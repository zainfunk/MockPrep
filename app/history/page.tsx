'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SessionRecord {
  id: string;
  date: string;
  problemTitle: string;
  difficulty: string;
  category: string;
  duration: string;
  scores: {
    communication: number;
    problemSolving: number;
    codeQuality: number;
  };
  overallScore: number;
  topImprovements: string[];
  fullFeedback: string;
}

const DIFFICULTY_BADGE: Record<string, string> = {
  easy: 'bg-green-900/60 text-green-300 border border-green-700/50',
  medium: 'bg-yellow-900/60 text-yellow-300 border border-yellow-700/50',
  hard: 'bg-red-900/60 text-red-300 border border-red-700/50',
};

function ScorePill({ label, value }: { label: string; value: number }) {
  const color =
    value >= 8
      ? 'text-green-400 bg-green-900/30 border-green-700/40'
      : value >= 5
      ? 'text-yellow-400 bg-yellow-900/30 border-yellow-700/40'
      : 'text-red-400 bg-red-900/30 border-red-700/40';
  return (
    <div className={`flex flex-col items-center px-3 py-1.5 rounded-lg border ${color}`}>
      <span className="text-xs text-gray-400 mb-0.5">{label}</span>
      <span className="font-bold text-sm">{value}/10</span>
    </div>
  );
}

function SessionCard({ session }: { session: SessionRecord }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden hover:border-gray-600 transition-colors"
    >
      {/* Card header — always visible, click to expand */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-5 focus:outline-none"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          {/* Left: title + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-semibold text-white truncate">{session.problemTitle}</h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                  DIFFICULTY_BADGE[session.difficulty] ?? 'bg-gray-700 text-gray-300'
                }`}
              >
                {session.difficulty}
              </span>
              <span className="text-xs text-gray-500 bg-gray-800 rounded px-2 py-0.5">
                {session.category}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {session.date} &nbsp;•&nbsp; {session.duration}
            </p>
          </div>

          {/* Right: overall score + expand indicator */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{session.overallScore}/10</div>
              <div className="text-xs text-gray-500">Overall</div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Score pills — always visible */}
        <div className="flex flex-wrap gap-2 mt-4">
          <ScorePill label="Communication" value={session.scores.communication} />
          <ScorePill label="Problem Solving" value={session.scores.problemSolving} />
          <ScorePill label="Code Quality" value={session.scores.codeQuality} />
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-800 pt-4 space-y-4">
          {/* Top improvements */}
          {session.topImprovements && session.topImprovements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Top Improvements</h4>
              <ol className="space-y-1">
                {session.topImprovements.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-400">
                    <span className="text-blue-400 font-bold shrink-0">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Closing note */}
          {session.fullFeedback && (
            <div className="bg-blue-900/20 border border-blue-700/40 rounded-lg p-3">
              <p className="text-blue-300 text-sm">{session.fullFeedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('interview_sessions');
      if (raw) {
        const parsed = JSON.parse(raw) as SessionRecord[];
        // Sort by most recent (highest numeric id) first
        parsed.sort((a, b) => Number(b.id) - Number(a.id));
        setSessions(parsed);
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    localStorage.removeItem('interview_sessions');
    setSessions([]);
    setConfirmClear(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/problems"
              className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-2 inline-flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to problems
            </Link>
            <h1 className="text-3xl font-bold text-white">Session History</h1>
            {loaded && sessions.length > 0 && (
              <p className="text-gray-500 text-sm mt-1">
                {sessions.length} session{sessions.length !== 1 ? 's' : ''} completed
              </p>
            )}
          </div>

          {/* Clear history button */}
          {loaded && sessions.length > 0 && (
            <button
              onClick={handleClear}
              onBlur={() => setConfirmClear(false)}
              className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                confirmClear
                  ? 'bg-red-600 border-red-500 text-white hover:bg-red-700'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-700'
              }`}
            >
              {confirmClear ? 'Confirm Clear?' : 'Clear History'}
            </button>
          )}
        </div>

        {/* Content */}
        {!loaded ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-600 text-lg mb-2">No sessions yet</div>
            <p className="text-gray-500 text-sm">
              Complete your first interview to see your history here.
            </p>
            <Link
              href="/problems"
              className="inline-block mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Browse Problems
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
