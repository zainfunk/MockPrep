import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { incrementMonthlyUsage, loadUserState } from '@/lib/subscription';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const state = await loadUserState(userId);
  const used = state.unlimited ? 0 : state.usage.count;
  const limit = state.limit;
  return NextResponse.json({
    used,
    limit,
    remaining: Math.max(limit - used, 0),
    tier: state.tier,
    period: state.usage.month,
    unlimited: state.unlimited,
    hasStripeCustomer: Boolean(state.subscription?.stripeCustomerId),
  });
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const state = await loadUserState(userId);
  if (state.unlimited) {
    return NextResponse.json({ used: 0, limit: 9999, remaining: 9999, tier: state.tier, period: state.usage.month, unlimited: true });
  }

  if (state.usage.count >= state.limit) {
    return NextResponse.json(
      { error: 'Monthly limit reached', used: state.usage.count, limit: state.limit, remaining: 0, tier: state.tier, period: state.usage.month, unlimited: false },
      { status: 402 },
    );
  }

  const updated = await incrementMonthlyUsage(userId);
  return NextResponse.json({
    used: updated.count,
    limit: state.limit,
    remaining: Math.max(state.limit - updated.count, 0),
    tier: state.tier,
    period: updated.month,
    unlimited: false,
  });
}
