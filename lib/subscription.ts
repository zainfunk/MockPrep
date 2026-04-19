import { clerkClient } from '@clerk/nextjs/server';

export const FREE_MONTHLY_LIMIT = 2;
export const PRO_MONTHLY_LIMIT = 20;
const UNLIMITED_EMAILS = ['funktastix0@gmail.com'];
const MAX_SESSION_IDS_RETAINED = 50;

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
  sessionIds: string[];
}

interface LegacyMonthlyUsage {
  month: string;
  count?: number;
  sessionIds?: string[];
}

interface PrivateMetadata {
  subscription?: Subscription;
  monthlyInterviews?: LegacyMonthlyUsage;
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
  const raw = meta.monthlyInterviews;
  if (!raw || raw.month !== month) {
    return { month, sessionIds: [] };
  }
  const ids = Array.isArray(raw.sessionIds) ? raw.sessionIds : [];
  return { month, sessionIds: ids };
}

export async function loadUserState(userId: string) {
  const { meta, email } = await fetchMeta(userId);
  const unlimited = UNLIMITED_EMAILS.includes(email);
  const tier = getTier(meta);
  const usage = getMonthlyUsage(meta);
  const limit = unlimited ? 9999 : getMonthlyLimit(tier);
  return { meta, email, unlimited, tier, usage, limit, subscription: meta.subscription };
}

export async function setSubscriptionByCustomerId(
  stripeCustomerId: string,
  sub: Partial<Subscription> & { tier: Tier },
): Promise<void> {
  const client = await clerkClient();
  const pageSize = 100;
  let offset = 0;
  let match: Awaited<ReturnType<typeof client.users.getUserList>>['data'][number] | null = null;

  while (!match) {
    const page = await client.users.getUserList({ limit: pageSize, offset });
    const found = page.data.find((u) => {
      const m = (u.privateMetadata ?? {}) as PrivateMetadata;
      return m.subscription?.stripeCustomerId === stripeCustomerId;
    });
    if (found) { match = found; break; }
    if (page.data.length < pageSize) break;
    offset += page.data.length;
    if (offset >= page.totalCount) break;
  }

  if (!match) {
    console.error('[subscription] no Clerk user found for Stripe customer', stripeCustomerId);
    return;
  }

  const existing = ((match.privateMetadata ?? {}) as PrivateMetadata).subscription ?? { tier: 'free' as Tier };
  await client.users.updateUserMetadata(match.id, {
    privateMetadata: { subscription: { ...existing, ...sub, stripeCustomerId } },
  });
}

export interface QuotaResult {
  ok: boolean;
  status?: number;
  error?: string;
  used?: number;
  limit?: number;
}

/**
 * Claim a quota slot for an interview session, keyed by a client-generated
 * sessionId. Idempotent — the same sessionId consumes one slot no matter how
 * many times it's seen. This is the ONLY place that mutates monthly usage;
 * called from every interview-related API route as defense-in-depth.
 */
export async function claimInterviewSession(
  userId: string,
  sessionId: string | undefined | null,
): Promise<QuotaResult> {
  if (!sessionId || typeof sessionId !== 'string' || sessionId.length > 100) {
    return { ok: false, status: 400, error: 'Missing or invalid sessionId' };
  }

  const state = await loadUserState(userId);
  if (state.unlimited) return { ok: true };

  const existingIds = state.usage.sessionIds;
  if (existingIds.includes(sessionId)) {
    return { ok: true, used: existingIds.length, limit: state.limit };
  }

  if (existingIds.length >= state.limit) {
    return {
      ok: false,
      status: 402,
      error: 'Monthly session limit reached. Upgrade to Pro for 20 sessions per month.',
      used: existingIds.length,
      limit: state.limit,
    };
  }

  const newIds = [...existingIds, sessionId].slice(-MAX_SESSION_IDS_RETAINED);
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      monthlyInterviews: { month: state.usage.month, sessionIds: newIds },
    },
  });

  return { ok: true, used: newIds.length, limit: state.limit };
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
