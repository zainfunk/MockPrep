'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';

interface LimitData {
  used: number;
  limit: number;
  remaining: number;
  tier: 'free' | 'pro';
  period: string;
  unlimited: boolean;
  hasStripeCustomer: boolean;
}

export default function PricingPage() {
  const params = useSearchParams();
  const status = params.get('status');
  const [limit, setLimit] = useState<LimitData | null>(null);
  const [loading, setLoading] = useState<'checkout' | 'portal' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const shouldPoll = status === 'success';
    const maxAttempts = shouldPoll ? 8 : 1;
    let attempts = 0;

    async function fetchLimit(): Promise<void> {
      attempts += 1;
      try {
        const res = await fetch('/api/user/daily-limit', { cache: 'no-store' });
        const data: LimitData | null = res.ok ? await res.json() : null;
        if (cancelled) return;
        setLimit(data);
        const tierResolved = data?.tier === 'pro' || data?.unlimited;
        if (shouldPoll && !tierResolved && attempts < maxAttempts) {
          setTimeout(fetchLimit, 1200);
        }
      } catch {
        if (!cancelled && shouldPoll && attempts < maxAttempts) {
          setTimeout(fetchLimit, 1200);
        }
      }
    }

    fetchLimit();
    return () => { cancelled = true; };
  }, [status]);

  async function handleUpgrade() {
    setLoading('checkout');
    setError(null);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Checkout failed');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(null);
    }
  }

  async function handleManage() {
    setLoading('portal');
    setError(null);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Portal failed');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(null);
    }
  }

  const hasStripeSub = limit?.tier === 'pro' && limit?.hasStripeCustomer;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-3">Pricing</h1>
        <p className="text-zinc-400">Start free. Upgrade when you&apos;re ready to practice at scale.</p>
        {status === 'success' && (
          <div className="mt-4 inline-block rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-emerald-300 text-sm">
            Welcome to Pro! Your subscription is active.
          </div>
        )}
        {status === 'cancelled' && (
          <div className="mt-4 inline-block rounded-lg bg-zinc-500/10 border border-zinc-500/30 px-4 py-2 text-zinc-300 text-sm">
            Checkout cancelled. No charge was made.
          </div>
        )}
      </div>

      {limit && (
        <div className="mb-8 text-center text-sm text-zinc-400">
          Current plan: <span className="font-semibold text-zinc-200 capitalize">{limit.unlimited ? 'Unlimited' : limit.tier}</span>
          {!limit.unlimited && <> · {limit.used}/{limit.limit} sessions this month</>}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
          <h2 className="text-xl font-semibold mb-1">Free</h2>
          <p className="text-zinc-400 text-sm mb-6">Try Placed, get a feel for it.</p>
          <div className="text-4xl font-bold mb-6">$0<span className="text-base font-normal text-zinc-400">/mo</span></div>
          <ul className="space-y-3 mb-8 text-sm">
            <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> 2 sessions per month</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> All 3 interview types</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Session history</li>
          </ul>
          {!hasStripeSub && !limit?.unlimited && <div className="text-xs text-zinc-500 text-center">Your current plan</div>}
        </div>

        <div className="rounded-2xl border border-blue-400/40 bg-gradient-to-br from-blue-500/10 to-transparent p-8 relative">
          <div className="absolute -top-3 left-8 rounded-full bg-blue-400 text-blue-950 text-xs font-semibold px-3 py-1">Recommended</div>
          <h2 className="text-xl font-semibold mb-1">Pro</h2>
          <p className="text-zinc-400 text-sm mb-6">Practice like you mean it.</p>
          <div className="text-4xl font-bold mb-6">$19<span className="text-base font-normal text-zinc-400">/mo</span></div>
          <ul className="space-y-3 mb-8 text-sm">
            <li className="flex gap-2"><Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" /> 20 sessions per month</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" /> All 3 interview types</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" /> Session history & exports</li>
            <li className="flex gap-2"><Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" /> Cancel anytime</li>
          </ul>
          {hasStripeSub ? (
            <button
              onClick={handleManage}
              disabled={loading !== null}
              className="w-full rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold py-3 transition disabled:opacity-50"
            >
              {loading === 'portal' ? 'Opening…' : 'Manage subscription'}
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={loading !== null}
              className="w-full rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 text-blue-950 font-semibold py-3 shadow-lg shadow-blue-500/20 transition hover:brightness-110 disabled:opacity-50"
            >
              {loading === 'checkout' ? 'Redirecting…' : 'Upgrade to Pro'}
            </button>
          )}
        </div>
      </div>

      {error && <div className="mt-6 text-center text-sm text-red-400">{error}</div>}
    </div>
  );
}
