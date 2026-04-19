import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { loadUserState } from '@/lib/subscription';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const state = await loadUserState(userId);
  const used = state.unlimited ? 0 : state.usage.sessionIds.length;
  const limit = state.limit;
  return NextResponse.json({
    used,
    limit,
    remaining: Math.max(limit - used, 0),
    tier: state.tier,
    period: state.usage.month,
    unlimited: state.unlimited,
    hasStripeCustomer: Boolean(state.subscription?.stripeCustomerId),
    subscriptionStatus: state.subscription?.status ?? null,
    cancelAtPeriodEnd: state.subscription?.cancelAtPeriodEnd ?? false,
  });
}
