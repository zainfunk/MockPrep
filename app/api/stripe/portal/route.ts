import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const customerId = (user.privateMetadata as { subscription?: { stripeCustomerId?: string } })?.subscription?.stripeCustomerId;
  if (!customerId) return NextResponse.json({ error: 'No Stripe customer' }, { status: 400 });

  const origin = req.headers.get('origin') ?? new URL(req.url).origin;
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/pricing`,
  });
  return NextResponse.json({ url: session.url });
}
