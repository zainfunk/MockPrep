'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, SignInButton } from '@clerk/nextjs';

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

interface GenAISessionRecord {
  id: string;
  date: string;
  problemId: string;
  problemTitle: string;
  difficulty: string;
  category: string;
  duration: number;
  promptCount: number;
  ranCode: boolean;
  codeMatchesAI: boolean;
  codeModifiedFromAI: boolean;
  scores: {
    promptQuality: number;
    outputValidation: number;
    humanJudgment: number;
    accountability: number;
  };
  fluencyLevel: string;
  averageScore: number;
  keyMoments: string[];
  topImprovements: string[];
  closingNote: string;
}

const DIFFICULTY_BADGE: Record<string, string> = {
  easy:   'bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700/50',
  medium: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700/50',
  hard:   'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700/50',
};

const FLUENCY_COLORS: Record<string, string> = {
  Strength:       'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-400 dark:border-green-600/50',
  'Mild Strength':'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-400 dark:border-emerald-600/50',
  Mixed:          'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-400 dark:border-yellow-600/50',
  'Mild Concern': 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-400 dark:border-orange-600/50',
  Concern:        'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-400 dark:border-red-600/50',
};

function ScorePill({ label, value, outOf = 10 }: { label: string; value: number; outOf?: number }) {
  const pct = value / outOf;
  const color =
    pct >= 0.8
      ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700/40'
      : pct >= 0.6
      ? 'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700/40'
      : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700/40';
  return (
    <div className={`flex flex-col items-center px-3 py-1.5 rounded-lg border ${color}`}>
      <span className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">{label}</span>
      <span className="font-bold text-sm">{value}/{outOf}</span>
    </div>
  );
}

function SessionCard({ session }: { session: SessionRecord }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-5 focus:outline-none"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">{session.problemTitle}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${DIFFICULTY_BADGE[session.difficulty] ?? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                {session.difficulty}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 rounded px-2 py-0.5">
                {session.category}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {session.date} &nbsp;•&nbsp; {session.duration}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{session.overallScore}/10</div>
              <div className="text-xs text-gray-500">Overall</div>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <ScorePill label="Communication" value={session.scores.communication} />
          <ScorePill label="Problem Solving" value={session.scores.problemSolving} />
          <ScorePill label="Code Quality" value={session.scores.codeQuality} />
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-4">
          {session.topImprovements && session.topImprovements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Top Improvements</h4>
              <ol className="space-y-1">
                {session.topImprovements.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {session.fullFeedback && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/40 rounded-lg p-3">
              <p className="text-blue-700 dark:text-blue-300 text-sm">{session.fullFeedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GenAISessionCard({ session }: { session: GenAISessionRecord }) {
  const [expanded, setExpanded] = useState(false);
  const fluencyClass = FLUENCY_COLORS[session.fluencyLevel] ?? FLUENCY_COLORS['Mixed'];

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-purple-300 dark:hover:border-purple-700/60 transition-colors">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-5 focus:outline-none"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">{session.problemTitle}</h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${DIFFICULTY_BADGE[session.difficulty] ?? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                {session.difficulty}
              </span>
              <span className="text-xs text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/40 rounded px-2 py-0.5">
                {session.category}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {new Date(session.date).toLocaleDateString()} &nbsp;•&nbsp;{' '}
              {Math.round(session.duration / 60)}m &nbsp;•&nbsp;{' '}
              {session.promptCount} prompt{session.promptCount !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${fluencyClass}`}>
              {session.fluencyLevel}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <ScorePill label="Prompt Quality" value={session.scores.promptQuality} outOf={5} />
          <ScorePill label="Output Validation" value={session.scores.outputValidation} outOf={5} />
          <ScorePill label="Human Judgment" value={session.scores.humanJudgment} outOf={5} />
          <ScorePill label="Accountability" value={session.scores.accountability} outOf={5} />
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-4">
          {session.keyMoments && session.keyMoments.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">Key Moments</h4>
              <ol className="space-y-1">
                {session.keyMoments.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-purple-600 dark:text-purple-400 font-bold shrink-0">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {session.topImprovements && session.topImprovements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Improvements</h4>
              <ul className="space-y-1">
                {session.topImprovements.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-gray-400 dark:text-gray-500 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {session.closingNote && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/40 rounded-lg p-3">
              <p className="text-purple-700 dark:text-purple-300 text-sm italic">{session.closingNote}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [genaiSessions, setGenaiSessions] = useState<GenAISessionRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmClearGenai, setConfirmClearGenai] = useState(false);
  const [dailyLimit, setDailyLimit] = useState<{ remaining: number; limit: number } | null>(null);

  useEffect(() => {
    if (!authLoaded || !isSignedIn) return;
    fetch('/api/user/daily-limit')
      .then((r) => r.json())
      .then((data) => setDailyLimit({ remaining: data.remaining, limit: data.limit }))
      .catch(() => {});
  }, [authLoaded, isSignedIn]);

  useEffect(() => {
    if (!authLoaded) return;

    if (isSignedIn) {
      // Fetch from DB when signed in
      fetch('/api/sessions')
        .then((r) => r.json())
        .then((data) => {
          const interviews = (data.interviewSessions ?? []).map((s: Record<string, unknown>) => ({
            id: s.id as string,
            date: new Date(s.created_at as string).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            problemTitle: s.problem_title as string,
            difficulty: s.difficulty as string,
            category: s.category as string,
            duration: s.duration as string,
            scores: {
              communication: s.score_communication as number,
              problemSolving: s.score_problem_solving as number,
              codeQuality: s.score_code_quality as number,
            },
            overallScore: s.overall_score as number,
            topImprovements: s.top_improvements as string[],
            fullFeedback: s.full_feedback as string,
          }));

          const genai = (data.genaiSessions ?? []).map((s: Record<string, unknown>) => ({
            id: s.id as string,
            date: s.created_at as string,
            problemId: s.problem_id as string,
            problemTitle: s.problem_title as string,
            difficulty: s.difficulty as string,
            category: s.category as string,
            duration: s.duration as number,
            promptCount: s.prompt_count as number,
            ranCode: s.ran_code as boolean,
            codeMatchesAI: s.code_matches_ai as boolean,
            codeModifiedFromAI: s.code_modified_from_ai as boolean,
            scores: {
              promptQuality: s.score_prompt_quality as number,
              outputValidation: s.score_output_validation as number,
              humanJudgment: s.score_human_judgment as number,
              accountability: s.score_accountability as number,
            },
            fluencyLevel: s.fluency_level as string,
            averageScore: s.average_score as number,
            keyMoments: s.key_moments as string[],
            topImprovements: s.top_improvements as string[],
            closingNote: s.closing_note as string,
          }));

          setSessions(interviews);
          setGenaiSessions(genai);
          setLoaded(true);
        })
        .catch(() => setLoaded(true));
    } else {
      // Fall back to localStorage when not signed in
      try {
        const raw = localStorage.getItem('interview_sessions');
        if (raw) {
          const parsed = JSON.parse(raw) as SessionRecord[];
          parsed.sort((a, b) => Number(b.id) - Number(a.id));
          setSessions(parsed);
        }
      } catch {}

      try {
        const raw = localStorage.getItem('genai_sessions');
        if (raw) {
          const parsed = JSON.parse(raw) as GenAISessionRecord[];
          parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setGenaiSessions(parsed);
        }
      } catch {}

      setLoaded(true);
    }
  }, [authLoaded, isSignedIn]);

  const handleClear = () => {
    if (!confirmClear) { setConfirmClear(true); return; }
    localStorage.removeItem('interview_sessions');
    setSessions([]);
    setConfirmClear(false);
  };

  const handleClearGenai = () => {
    if (!confirmClearGenai) { setConfirmClearGenai(true); return; }
    localStorage.removeItem('genai_sessions');
    setGenaiSessions([]);
    setConfirmClearGenai(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {authLoaded && !isSignedIn && (
        <div className="bg-blue-50 dark:bg-blue-950/60 border-b border-blue-200 dark:border-blue-700/40">
          <div className="max-w-3xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-medium">Sign in to save your session history across devices.</span>
              {' '}Your local history is visible below.
            </p>
            <SignInButton mode="modal">
              <button className="shrink-0 text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <Link
              href="/problems"
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-2 inline-flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to problems
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Session History</h1>
            {loaded && (sessions.length > 0 || genaiSessions.length > 0) && (
              <p className="text-gray-500 text-sm mt-1">
                {sessions.length} coding + {genaiSessions.length} GenAI session{(sessions.length + genaiSessions.length) !== 1 ? 's' : ''} completed
              </p>
            )}
          </div>

          {dailyLimit !== null && (
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-xs text-gray-500 dark:text-gray-400">Today&apos;s interviews</span>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
                <div className="w-20 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${(dailyLimit.remaining / dailyLimit.limit) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white tabular-nums">
                  {dailyLimit.remaining}
                  <span className="text-gray-400 dark:text-gray-500 font-normal">/{dailyLimit.limit}</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {!loaded ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : sessions.length === 0 && genaiSessions.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 dark:text-gray-600 text-lg mb-2">No sessions yet</div>
            <p className="text-gray-500 text-sm">Complete your first session to see history here.</p>
            <Link
              href="/problems"
              className="inline-block mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              Browse Problems
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {sessions.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Coding Sessions</h2>
                  <button
                    onClick={handleClear}
                    onBlur={() => setConfirmClear(false)}
                    className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                      confirmClear
                        ? 'bg-red-600 border-red-500 text-white hover:bg-red-700'
                        : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700'
                    }`}
                  >
                    {confirmClear ? 'Confirm Clear?' : 'Clear'}
                  </button>
                </div>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              </section>
            )}

            {genaiSessions.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">GenAI Fluency Sessions</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {genaiSessions.length} session{genaiSessions.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={handleClearGenai}
                    onBlur={() => setConfirmClearGenai(false)}
                    className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                      confirmClearGenai
                        ? 'bg-red-600 border-red-500 text-white hover:bg-red-700'
                        : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700'
                    }`}
                  >
                    {confirmClearGenai ? 'Confirm Clear?' : 'Clear'}
                  </button>
                </div>
                <div className="space-y-4">
                  {genaiSessions.map((session) => (
                    <GenAISessionCard key={session.id} session={session} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
