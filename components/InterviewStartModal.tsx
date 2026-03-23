'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

export interface ModalProblem {
  id: string;
  title: string;
  difficulty: string;
  type: 'coding' | 'genai';
  href: string;
}

interface LimitData {
  used: number;
  limit: number;
  remaining: number;
}

type ModalState = 'loading' | 'ready' | 'submitting' | 'error';

interface Props {
  problem: ModalProblem | null;
  onClose: () => void;
}

const DIFFICULTY_BADGE: Record<string, string> = {
  easy: 'bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700/40',
  medium: 'bg-yellow-100 text-yellow-700 border border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700/40',
  hard: 'bg-red-100 text-red-700 border border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700/40',
};

export default function InterviewStartModal({ problem, onClose }: Props) {
  const router = useRouter();
  const [modalState, setModalState] = useState<ModalState>('loading');
  const [limitData, setLimitData] = useState<LimitData | null>(null);

  useEffect(() => {
    if (!problem) return;

    setModalState('loading');
    setLimitData(null);

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
  const accentColor = isCoding ? 'blue' : 'purple';

  async function handleStart() {
    if (!problem) return;
    setModalState('submitting');
    try {
      const res = await fetch('/api/user/daily-limit', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to increment');
      router.push(problem.href);
    } catch {
      setModalState('error');
    }
  }

  const progressPercent = limitData ? Math.min((limitData.used / limitData.limit) * 100, 100) : 0;
  const afterUsed = limitData ? limitData.used + 1 : null;
  const afterRemaining = limitData ? limitData.remaining - 1 : null;

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-sm w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Type pill header */}
        <div className={`px-6 pt-5 pb-0`}>
          <span className={`inline-block text-xs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-sm ${
            isCoding
              ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50'
              : 'bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50'
          }`}>
            {isCoding ? 'Coding Interview' : 'GenAI Fluency'}
          </span>
        </div>

        {/* Problem info */}
        <div className="px-6 pt-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
            {problem.title}
          </h2>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${DIFFICULTY_BADGE[problem.difficulty] ?? DIFFICULTY_BADGE.medium}`}>
            {problem.difficulty}
          </span>
        </div>

        {/* Daily limit section */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
            Daily interviews
          </p>

          {modalState === 'loading' && (
            <div className="space-y-2">
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden animate-pulse" />
              <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
            </div>
          )}

          {modalState === 'error' && (
            <p className="text-sm text-red-500 dark:text-red-400">
              Could not load usage data. You can still start the interview.
            </p>
          )}

          {(modalState === 'ready' || modalState === 'submitting') && limitData && (
            <>
              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    accentColor === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-white">{limitData.used}</span>
                  <span className="text-slate-400"> / {limitData.limit} used today</span>
                </span>
                {afterRemaining !== null && (
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {afterRemaining < 0 ? 0 : afterRemaining} remaining after this
                  </span>
                )}
              </div>

              {/* Arrow showing deduction */}
              {afterUsed !== null && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Starting this session will count as{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {afterUsed}/{limitData.limit}
                  </span>{' '}
                  for today.
                </p>
              )}

              {limitData.remaining <= 0 && (
                <div className="mt-3 flex items-start gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-sm px-3 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <span className="text-xs">
                    You&apos;ve used all {limitData.limit} interviews for today — you can still start this session.
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors px-4 py-2 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-sm cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleStart}
            disabled={modalState === 'submitting'}
            className={`flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
              isCoding
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {modalState === 'submitting' ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Starting…
              </>
            ) : (
              <>
                Start Interview
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
