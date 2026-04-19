'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { hasSavedSession } from '@/lib/sessionPersistence';

export interface ModalProblem {
  id: string;
  title: string;
  difficulty: string;
  type: 'coding' | 'genai' | 'fluency';
  href: string;
}

interface LimitData {
  used: number;
  limit: number;
  remaining: number;
  tier?: 'free' | 'pro';
  unlimited?: boolean;
}

type ModalState = 'loading' | 'ready' | 'submitting' | 'error';

interface Props {
  problem: ModalProblem | null;
  onClose: () => void;
}

const DIFFICULTY_STYLES: Record<string, { badge: string; label: string }> = {
  easy:   { badge: 'bg-emerald-500/10 text-emerald-300 border border-emerald-400/20', label: 'EASY' },
  medium: { badge: 'bg-amber-500/10 text-amber-300 border border-amber-400/20',       label: 'MEDIUM' },
  hard:   { badge: 'bg-red-500/10 text-red-400 border border-red-400/20',             label: 'HARD' },
};

export default function InterviewStartModal({ problem, onClose }: Props) {
  const router = useRouter();
  const [modalState, setModalState] = useState<ModalState>('loading');
  const [limitData, setLimitData] = useState<LimitData | null>(null);
  const [isResume, setIsResume] = useState(false);

  useEffect(() => {
    if (!problem) return;

    setModalState('loading');
    setLimitData(null);

    const persistKey = problem.type === 'coding' ? 'coding' : problem.type === 'genai' ? 'genai' : null;
    setIsResume(persistKey ? hasSavedSession(persistKey, problem.id) : false);

    let cancelled = false;

    fetch('/api/user/daily-limit')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data: LimitData) => {
        if (cancelled) return;
        setLimitData(data);
        setModalState('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setModalState('error');
      });

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      cancelled = true;
      document.removeEventListener('keydown', handleKey);
    };
  }, [problem?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!problem || typeof document === 'undefined') return null;

  const isCoding = problem.type === 'coding';
  const isFluency = problem.type === 'fluency';
  const diffStyle = DIFFICULTY_STYLES[problem.difficulty] ?? DIFFICULTY_STYLES.medium;

  // Gradient & accent colors
  const btnGradient = isCoding
    ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-blue-950 shadow-blue-400/20'
    : isFluency
    ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-emerald-950 shadow-emerald-400/20'
    : 'bg-gradient-to-br from-purple-400 to-purple-500 text-purple-950 shadow-purple-400/20';
  const progressBar = isCoding
    ? 'from-blue-400 to-blue-500'
    : isFluency
    ? 'from-emerald-400 to-teal-500'
    : 'from-purple-400 to-purple-500';
  const topBorder = isCoding
    ? 'border-t-blue-400'
    : isFluency
    ? 'border-t-emerald-400'
    : 'border-t-purple-400';
  const labelColor = isCoding
    ? 'text-blue-400'
    : isFluency
    ? 'text-emerald-400'
    : 'text-purple-400';

  const progressPercent = limitData ? Math.min((limitData.used / limitData.limit) * 100, 100) : 0;
  const afterUsed = limitData ? limitData.used + 1 : null;
  const afterRemaining = limitData ? limitData.remaining - 1 : null;

  async function handleStart() {
    if (!problem) return;
    setModalState('submitting');
    if (isResume) {
      router.push(problem.href);
      return;
    }
    try {
      const res = await fetch('/api/user/daily-limit', { method: 'POST' });
      if (res.status === 402) {
        const data = await res.json().catch(() => ({}));
        setLimitData((prev) =>
          prev ? { ...prev, used: data.used ?? prev.used, remaining: 0 } : prev,
        );
        setModalState('ready');
        return;
      }
    } catch {}
    router.push(problem.href);
  }

  const atLimit = Boolean(limitData && !limitData.unlimited && limitData.remaining <= 0);

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl bg-[#131314] rounded-xl shadow-2xl overflow-hidden border-t-4 ${topBorder} ring-1 ring-white/5`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 sm:p-10 space-y-8">

          {/* Header */}
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1.5 min-w-0">
              <span
                className={`font-['var(--font-jetbrains-mono)'] text-[10px] ${labelColor} uppercase tracking-[0.2em] font-medium block`}
                style={{ fontFamily: 'var(--font-jetbrains-mono)' }}
              >
                {isCoding ? 'Coding Interview' : isFluency ? 'GenAI Fluency' : 'GenAI Coding'}
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight"
                style={{ fontFamily: 'var(--font-space-grotesk)' }}
              >
                {problem.title}
              </h2>
            </div>
            {!isFluency && (
              <span
                className={`flex-shrink-0 text-xs font-medium px-4 py-1.5 rounded-full ${diffStyle.badge}`}
                style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '10px', letterSpacing: '0.1em' }}
              >
                {diffStyle.label}
              </span>
            )}
          </div>

          {/* Daily Session Capacity */}
          <div className="bg-zinc-950/50 p-6 rounded-lg border border-white/5 space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <label
                  className="text-slate-400 font-bold uppercase tracking-widest block"
                  style={{ fontFamily: 'var(--font-space-grotesk)', fontSize: '11px' }}
                >
                  Monthly Session Capacity
                </label>

                {modalState === 'loading' && (
                  <div className="flex items-baseline gap-2">
                    <div className="h-9 w-12 bg-zinc-800 rounded animate-pulse" />
                    <div className="h-5 w-8 bg-zinc-800 rounded animate-pulse" />
                  </div>
                )}

                {modalState === 'error' && (
                  <p className="text-sm text-red-400">
                    Could not load usage data. You can still start.
                  </p>
                )}

                {(modalState === 'ready' || modalState === 'submitting') && limitData && (
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-3xl font-bold text-white tracking-tighter"
                      style={{ fontFamily: 'var(--font-space-grotesk)' }}
                    >
                      {limitData.used}
                    </span>
                    <span className="text-zinc-600 font-medium" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                      / {limitData.limit}
                    </span>
                  </div>
                )}
              </div>

              {afterRemaining !== null && (
                <span
                  className="text-zinc-500 pb-1"
                  style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '10px' }}
                >
                  {afterRemaining < 0 ? 0 : afterRemaining} SLOTS REMAINING
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="relative h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              {(modalState === 'ready' || modalState === 'submitting') && (
                <div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${progressBar} shadow-lg transition-all duration-300`}
                  style={{ width: `${progressPercent}%` }}
                />
              )}
              {modalState === 'loading' && (
                <div className="absolute top-0 left-0 h-full w-1/3 bg-zinc-700 rounded-full animate-pulse" />
              )}
            </div>

            {/* Limit warning */}
            {(modalState === 'ready' || modalState === 'submitting') && atLimit && (
              <div className="flex items-start gap-2 text-amber-400 bg-amber-500/10 border border-amber-400/20 rounded-lg px-3 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span className="text-xs" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                  You&apos;ve used all {limitData!.limit} sessions this month. {limitData!.tier === 'pro' ? 'Resets next month.' : 'Upgrade to Pro for 20/month.'}
                </span>
              </div>
            )}

            {/* "will count as" note */}
            {afterUsed !== null && limitData && !atLimit && !limitData.unlimited && !isResume && (
              <p className="text-zinc-500 text-xs" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                Starting will count as{' '}
                <span className="text-zinc-300 font-semibold">{afterUsed}/{limitData.limit}</span> this month.
              </p>
            )}
            {isResume && !atLimit && (
              <p className="text-emerald-400/90 text-xs" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                You have a session in progress — resuming won&apos;t count against your quota.
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            {atLimit && limitData?.tier !== 'pro' ? (
              <button
                type="button"
                onClick={() => router.push('/pricing')}
                className="flex-1 px-8 py-4 bg-gradient-to-br from-blue-400 to-blue-500 text-blue-950 font-bold rounded-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-400/20 cursor-pointer"
                style={{ fontFamily: 'var(--font-space-grotesk)', letterSpacing: '0.05em' }}
              >
                <span>UPGRADE TO PRO</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStart}
                disabled={modalState === 'submitting' || modalState === 'loading' || atLimit}
                className={`flex-1 px-8 py-4 ${btnGradient} font-bold rounded-md hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed shadow-lg cursor-pointer`}
                style={{ fontFamily: 'var(--font-space-grotesk)', letterSpacing: '0.05em' }}
              >
                {modalState === 'submitting' ? (
                  <>
                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    STARTING…
                  </>
                ) : (
                  <>
                    <span>{atLimit ? 'LIMIT REACHED' : isResume ? 'RESUME INTERVIEW' : 'START INTERVIEW'}</span>
                    {!atLimit && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    )}
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white transition-all active:scale-[0.98] rounded-md cursor-pointer uppercase tracking-widest text-sm"
              style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '12px' }}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Terminal accent footer */}
        <div className="bg-zinc-900 px-8 sm:px-10 py-3 flex justify-between items-center border-t border-white/5">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500/40" />
            <div className="w-2 h-2 rounded-full bg-amber-500/40" />
            <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
          </div>
          <span
            className="text-zinc-600"
            style={{ fontFamily: 'var(--font-jetbrains-mono)', fontSize: '10px' }}
          >
            ID: {problem.id.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
