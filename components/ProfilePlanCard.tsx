'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const T = {
  surfaceMid: '#1a191b',
  surfaceTop: '#262627',
  primary: '#85adff',
  tertiary: '#9bffce',
  textPrimary: '#ffffff',
  textSecond: '#adaaab',
  textMuted: '#767576',
  error: '#ff716c',
  amber: '#facc15',
  outline: 'rgba(72,72,73,0.15)',
};

interface QuotaState {
  used: number;
  limit: number;
  remaining: number;
  tier: 'free' | 'pro';
  unlimited: boolean;
  hasStripeCustomer: boolean;
}

export default function ProfilePlanCard() {
  const [state, setState] = useState<QuotaState | null>(null);
  const [opening, setOpening] = useState<'portal' | null>(null);

  useEffect(() => {
    fetch('/api/user/daily-limit')
      .then((r) => (r.ok ? r.json() : null))
      .then(setState)
      .catch(() => setState(null));
  }, []);

  async function openPortal() {
    setOpening('portal');
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.url) window.location.href = data.url;
    } catch {}
    setOpening(null);
  }

  if (!state) return null;

  const pct = state.unlimited ? 0 : Math.min(1, state.used / Math.max(state.limit, 1));
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * (1 - pct);
  const ringColor = state.unlimited
    ? T.tertiary
    : pct >= 1
    ? T.error
    : pct >= 0.8
    ? T.amber
    : T.primary;

  const tierLabel = state.unlimited ? 'Unlimited' : state.tier === 'pro' ? 'Pro' : 'Free';
  const accent = state.unlimited ? T.tertiary : state.tier === 'pro' ? T.primary : T.textSecond;

  return (
    <div
      className="bento-card mb-8"
      style={{
        background: T.surfaceMid,
        borderTop: `0.25rem solid ${accent}`,
        padding: '22px 24px',
      }}
    >
      <div className="flex flex-wrap items-center gap-6 justify-between">
        {/* Left: tier badge + copy */}
        <div className="flex items-center gap-5 min-w-0">
          <svg width={88} height={88} style={{ flexShrink: 0 }}>
            <circle cx={44} cy={44} r={radius} fill="none" stroke={T.surfaceTop} strokeWidth={6} />
            <circle
              cx={44}
              cy={44}
              r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth={6}
              strokeDasharray={circumference}
              strokeDashoffset={state.unlimited ? 0 : dash}
              strokeLinecap="round"
              transform="rotate(-90 44 44)"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
            <text
              x={44}
              y={48}
              textAnchor="middle"
              style={{
                fill: T.textPrimary,
                fontSize: 15,
                fontWeight: 700,
                fontFamily: 'var(--font-space-grotesk), sans-serif',
              }}
            >
              {state.unlimited ? '∞' : `${state.used}/${state.limit}`}
            </text>
          </svg>

          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains-mono), monospace',
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: T.textMuted,
                }}
              >
                Plan
              </span>
              <span
                className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold tracking-widest uppercase"
                style={{ background: `${accent}20`, color: accent }}
              >
                {tierLabel}
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: T.textPrimary,
                lineHeight: 1.2,
              }}
            >
              {state.unlimited
                ? 'Unlimited sessions'
                : state.tier === 'pro'
                ? `${state.remaining} of ${state.limit} sessions left`
                : state.remaining > 0
                ? `${state.remaining} of ${state.limit} free sessions left`
                : 'Monthly limit reached'}
            </p>
            <p
              className="mt-1"
              style={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: '0.6875rem',
                color: T.textMuted,
              }}
            >
              {state.unlimited ? 'Dev override active' : 'Resets on the 1st of each month'}
            </p>
          </div>
        </div>

        {/* Right: CTAs */}
        <div className="flex items-center gap-2 shrink-0">
          {state.tier === 'pro' && state.hasStripeCustomer ? (
            <button
              type="button"
              onClick={openPortal}
              disabled={opening !== null}
              className="rounded-md px-4 py-2 transition-colors disabled:opacity-60"
              style={{
                background: T.surfaceTop,
                color: T.textPrimary,
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: '0.8125rem',
                fontWeight: 600,
                border: `1px solid ${T.outline}`,
              }}
            >
              {opening === 'portal' ? 'Opening…' : 'Manage subscription'}
            </button>
          ) : !state.unlimited ? (
            <Link
              href="/pricing"
              className="rounded-md px-4 py-2 transition-all hover:brightness-110"
              style={{
                background: `linear-gradient(135deg, ${T.primary}, #6e9fff)`,
                color: '#002c66',
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: '0.8125rem',
                fontWeight: 700,
              }}
            >
              {state.tier === 'free' ? 'Upgrade to Pro' : 'View plans'}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
