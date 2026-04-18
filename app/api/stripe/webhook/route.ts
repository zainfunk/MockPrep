import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { setSubscriptionByCustomerId, setSubscriptionForUser } from '@/lib/subscription';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: 'Missing STRIPE_WEBHOOK_SECRET' }, { status: 500 });

  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  const body = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error('[stripe webhook] signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
        if (!userId || !customerId) break;

        let currentPeriodEnd: string | undefined;
        let status: string | undefined;
        let cancelAtPeriodEnd = false;
        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const periodEnd = sub.items.data[0]?.current_period_end;
          currentPeriodEnd = periodEnd ? new Date(periodEnd * 1000).toISOString() : undefined;
          status = sub.status;
          cancelAtPeriodEnd = sub.cancel_at_period_end;
        }

        await setSubscriptionForUser(userId, {
          tier: 'pro',
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId ?? undefined,
          currentPeriodEnd,
          status,
          cancelAtPeriodEnd,
        });
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
        const userId = sub.metadata?.clerkUserId;
        const stillActive = sub.status === 'active' || sub.status === 'trialing';
        const periodEnd = sub.items.data[0]?.current_period_end;
        const payload = {
          tier: stillActive ? ('pro' as const) : ('free' as const),
          stripeSubscriptionId: sub.id,
          currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000).toISOString() : undefined,
          status: sub.status,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        };
        if (userId) await setSubscriptionForUser(userId, payload);
        else await setSubscriptionByCustomerId(customerId, payload);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id;
        const userId = sub.metadata?.clerkUserId;
        const payload = {
          tier: 'free' as const,
          stripeSubscriptionId: sub.id,
          status: 'canceled',
          cancelAtPeriodEnd: false,
        };
        if (userId) await setSubscriptionForUser(userId, payload);
        else await setSubscriptionByCustomerId(customerId, payload);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id;
        if (customerId) {
          await setSubscriptionByCustomerId(customerId, { tier: 'pro', status: 'past_due' });
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error('[stripe webhook] handler error:', err);
    return NextResponse.json({ error: 'Handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
