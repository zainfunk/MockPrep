'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ProblemSummary {
  id: string;
  title: string;
  type: 'coding' | 'genai';
}

interface InProgress {
  problem: ProblemSummary;
  timeElapsed: number;
  messageCount: number;
  savedAt: number;
}

const KEY_PREFIX = 'placed:session:v1:';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m >= 45) return 'ended';
  if (m === 0 && s === 0) return 'just started';
  return m > 0 ? `${m}m elapsed` : `${s}s elapsed`;
}

function formatAge(savedAt: number): string {
  const diff = Date.now() - savedAt;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'moments ago';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ResumeBanner({
  problemLookup,
}: {
  problemLookup: Record<string, ProblemSummary>;
}) {
  const [session, setSession] = useState<InProgress | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      let best: InProgress | null = null;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(KEY_PREFIX)) continue;
        const rest = key.slice(KEY_PREFIX.length);
        const colon = rest.indexOf(':');
        if (colon < 0) continue;
        const type = rest.slice(0, colon);
        const problemId = rest.slice(colon + 1);
        if (type !== 'coding' && type !== 'genai') continue;
        const problem = problemLookup[`${type}:${problemId}`];
        if (!problem) continue;
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        let parsed: { savedAt?: number; data?: { messages?: unknown[]; timeElapsed?: number } };
        try { parsed = JSON.parse(raw); } catch { continue; }
        if (!parsed.savedAt || Date.now() - parsed.savedAt > MAX_AGE_MS) continue;
        const messageCount = Array.isArray(parsed.data?.messages) ? parsed.data!.messages!.length : 0;
        if (messageCount === 0) continue;
        const timeElapsed = typeof parsed.data?.timeElapsed === 'number' ? parsed.data.timeElapsed : 0;
        const candidate: InProgress = { problem, timeElapsed, messageCount, savedAt: parsed.savedAt };
        if (!best || candidate.savedAt > best.savedAt) best = candidate;
      }
      setSession(best);
    } catch {
      setSession(null);
    }
  }, [problemLookup]);

  if (!mounted || !session || dismissed) return null;

  const href = session.problem.type === 'coding'
    ? `/interview/${session.problem.id}`
    : `/genai/${session.problem.id}`;

  return (
    <div
      className="flex items-center gap-3 rounded-lg border px-4 py-3 mb-6"
      style={{
        background: 'rgba(133,173,255,0.06)',
        borderColor: 'rgba(133,173,255,0.25)',
      }}
    >
      <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-md" style={{ background: 'rgba(133,173,255,0.14)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#85adff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: '#85adff' }}>
            Resume
          </span>
          <span className="text-sm font-semibold text-white truncate">
            {session.problem.title}
          </span>
        </div>
        <div className="text-[11px] mt-0.5" style={{ color: '#767576', fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
          {session.problem.type === 'coding' ? 'Coding interview' : 'GenAI coding'} · {formatElapsed(session.timeElapsed)} · saved {formatAge(session.savedAt)}
        </div>
      </div>

      <Link
        href={href}
        className="shrink-0 rounded-md px-3 py-1.5 text-[11px] font-semibold text-[#002c66] transition-all hover:brightness-110"
        style={{ background: 'linear-gradient(135deg, #85adff, #6e9fff)', fontFamily: 'var(--font-space-grotesk), sans-serif' }}
      >
        Continue →
      </Link>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="shrink-0 text-[#767576] hover:text-white px-1 text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}
