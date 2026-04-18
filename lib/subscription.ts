import { clerkClient } from '@clerk/nextjs/server';

export const FREE_MONTHLY_LIMIT = 2;
export const PRO_MONTHLY_LIMIT = 20;
const UNLIMITED_EMAILS = ['funktastix0@gmail.com'];

export type Tier = 'free' | 'pro';

export interface Subscription {
  tier: Tier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: string;
  status?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface MonthlyUsage {
  month: string;
  count: number;
}

interface PrivateMetadata {
  subscription?: Subscription;
  monthlyInterviews?: MonthlyUsage;
  dailyInterviews?: { date: string; count: number };
}

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

async function fetchMeta(userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const meta = (user.privateMetadata ?? {}) as PrivateMetadata;
  const email = user.emailAddresses?.[0]?.emailAddress ?? '';
  return { meta, email };
}

export function getTier(meta: PrivateMetadata): Tier {
  return meta.subscription?.tier === 'pro' ? 'pro' : 'free';
}

export function getMonthlyLimit(tier: Tier): number {
  return tier === 'pro' ? PRO_MONTHLY_LIMIT : FREE_MONTHLY_LIMIT;
}

export function getMonthlyUsage(meta: PrivateMetadata): MonthlyUsage {
  const month = currentMonth();
  if (!meta.monthlyInterviews || meta.monthlyInterviews.month !== month) {
    return { month, count: 0 };
  }
  return meta.monthlyInterviews;
}

export async function loadUserState(userId: string) {
  const { meta, email } = await fetchMeta(userId);
  const unlimited = UNLIMITED_EMAILS.includes(email);
  const tier = getTier(meta);
  const usage = getMonthlyUsage(meta);
  const limit = unlimited ? 9999 : getMonthlyLimit(tier);
  return { meta, email, unlimited, tier, usage, limit, subscription: meta.subscription };
}

export async function incrementMonthlyUsage(userId: string): Promise<MonthlyUsage> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const meta = (user.privateMetadata ?? {}) as PrivateMetadata;
  const current = getMonthlyUsage(meta);
  const updated = { month: current.month, count: current.count + 1 };
  await client.users.updateUserMetadata(userId, {
    privateMetadata: { monthlyInterviews: updated },
  });
  return updated;
}

export async function setSubscriptionByCustomerId(
  stripeCustomerId: string,
  sub: Partial<Subscription> & { tier: Tier },
): Promise<void> {
  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({ limit: 100 });
  const match = users.find((u) => {
    const m = (u.privateMetadata ?? {}) as PrivateMetadata;
    return m.subscription?.stripeCustomerId === stripeCustomerId;
  });
  if (!match) {
    console.error('[subscription] no Clerk user found for customer', stripeCustomerId);
    return;
  }
  const existing = ((match.privateMetadata ?? {}) as PrivateMetadata).subscription ?? { tier: 'free' as Tier };
  await client.users.updateUserMetadata(match.id, {
    privateMetadata: { subscription: { ...existing, ...sub, stripeCustomerId } },
  });
}

export async function setSubscriptionForUser(
  userId: string,
  sub: Partial<Subscription> & { tier: Tier },
): Promise<void> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existing = ((user.privateMetadata ?? {}) as PrivateMetadata).subscription ?? { tier: 'free' as Tier };
  await client.users.updateUserMetadata(userId, {
    privateMetadata: { subscription: { ...existing, ...sub } },
  });
}
