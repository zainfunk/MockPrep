'use client';

import { useState, useEffect, useRef, useCallback, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getRandomFluencyQuestions } from '@/data/genaiFluentQuestions';
import type { FluencyQuestion } from '@/data/genaiFluentQuestions';

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuestionScores {
  specificity: number;
  genaiLiteracy: number;
  criticalThinking: number;
  judgment: number;
  responsibility: number;
  learningAgility: number;
  communication: number;
}

interface QuestionResult {
  scores: QuestionScores;
  totalScore: number;
  notes: string;
}

interface FluencyFeedback {
  questionResults: QuestionResult[];
  aggregateScores: QuestionScores;
  totalScore: number;
  rating: string;
  hasRedFlags: boolean;
  redFlagsPresent: string[];
  redFlagDetails: string[];
  keyStrengths: string[];
  keyImprovements: string[];
  closingNote: string;
}

// ── Design tokens ─────────────────────────────────────────────────────────────

const T = {
  bg: '#0e0e0f',
  surface: '#131314',
  surfaceHigh: '#1a191b',
  surfaceHigher: '#262627',
  border: 'rgba(255,255,255,0.07)',
  primary: '#9bffce',       // green accent for fluency
  secondary: '#adaaab',
  muted: '#767576',
  dimmed: '#484849',
  white: '#ffffff',
} as const;

const CRITERIA_META: { key: keyof QuestionScores; label: string; abbr: string }[] = [
  { key: 'specificity',      label: 'Specificity & Concreteness',    abbr: 'S.C.' },
  { key: 'genaiLiteracy',    label: 'GenAI Literacy',                abbr: 'G.L.' },
  { key: 'criticalThinking', label: 'Critical Thinking & Evaluation', abbr: 'C.T.' },
  { key: 'judgment',         label: 'Judgment & Risk Awareness',     abbr: 'J.R.' },
  { key: 'responsibility',   label: 'Responsibility & Ethics',       abbr: 'R.E.' },
  { key: 'learningAgility',  label: 'Learning Agility',              abbr: 'L.A.' },
  { key: 'communication',    label: 'Communication & Influence',     abbr: 'C.I.' },
];

function ratingColor(rating: string) {
  switch (rating) {
    case 'Exceptional': return '#9bffce';
    case 'Proficient':  return '#85adff';
    case 'Developing':  return '#fbbf24';
    case 'Insufficient':return '#d7383b';
    default:            return '#adaaab';
  }
}

function scoreColor(score: number) {
  if (score >= 3.5) return '#9bffce';
  if (score >= 2.5) return '#85adff';
  if (score >= 1.5) return '#fbbf24';
  return '#d7383b';
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconArrowRight() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

function IconArrowLeft() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

function IconFlag() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18M3 6l9-3 9 3v9l-9 3-9-3V6z" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

// ── ScoreBar ──────────────────────────────────────────────────────────────────

function ScoreBar({ score, max = 4 }: { score: number; max?: number }) {
  const pct = Math.min((score / max) * 100, 100);
  const color = scoreColor(score);
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 bg-[#1a191b] rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-mono w-8 text-right" style={{ color }}>{score.toFixed(1)}</span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function GenAIFluencySession() {
  const router = useRouter();

  // questions selected on mount
  const [questions] = useState<FluencyQuestion[]>(() => getRandomFluencyQuestions(3));
  const [responses, setResponses] = useState<string[]>(['', '', '']);
  const [currentQ, setCurrentQ] = useState(0);

  // timer
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // phase
  const [phase, setPhase] = useState<'answering' | 'submitting' | 'feedback'>('answering');
  const [feedback, setFeedback] = useState<FluencyFeedback | null>(null);
  const [error, setError] = useState('');

  // chat
  interface ChatMsg { role: 'user' | 'assistant'; content: string }
  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // expanded per-question in feedback
  const [expandedQ, setExpandedQ] = useState<number | null>(0);

  // reset chat when switching questions
  useEffect(() => {
    setChatHistory([]);
    setChatInput('');
  }, [currentQ]);

  // scroll chat to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatLoading]);

  const sendChatMessage = useCallback(async () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;
    const q = questions[currentQ];
    const updated: ChatMsg[] = [...chatHistory, { role: 'user', content: msg }];
    setChatHistory(updated);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch('/api/genai-fluency-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.question,
          category: q.category,
          history: chatHistory,
          message: msg,
        }),
      });
      const data = await res.json();
      setChatHistory([...updated, { role: 'assistant', content: data.reply }]);
    } catch {
      setChatHistory([...updated, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, chatLoading, chatHistory, questions, currentQ]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleSubmit = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setPhase('submitting');

    try {
      const res = await fetch('/api/genai-fluency-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: questions.map((q, i) => ({
            question: q.question,
            category: q.category,
            response: responses[i] || '',
          })),
          duration,
        }),
      });

      if (!res.ok) throw new Error('Feedback request failed');
      const data: FluencyFeedback = await res.json();
      setFeedback(data);

      // Save session
      const record = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        duration,
        questions: questions.map((q, i) => ({
          id: q.id,
          question: q.question,
          category: q.category,
          response: responses[i] || '',
        })),
        questionResults: data.questionResults,
        aggregateScores: data.aggregateScores,
        totalScore: data.totalScore,
        rating: data.rating,
        hasRedFlags: data.hasRedFlags,
        redFlagDetails: data.redFlagDetails ?? [],
        keyStrengths: data.keyStrengths ?? [],
        keyImprovements: data.keyImprovements ?? [],
        closingNote: data.closingNote,
      };

      try {
        const existing = JSON.parse(localStorage.getItem('fluency_sessions') ?? '[]');
        existing.unshift(record);
        localStorage.setItem('fluency_sessions', JSON.stringify(existing));
      } catch {}
      try {
        const res = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'fluency', session: record }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          console.error('[GenAIFluencySession] /api/sessions POST failed:', res.status, body);
        }
      } catch (err) {
        console.error('[GenAIFluencySession] /api/sessions POST network error:', err);
      }

      setPhase('feedback');
    } catch {
      setError('Something went wrong evaluating your responses. Please try again.');
      setPhase('answering');
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    }
  }, [questions, responses]);

  const allAnswered = responses.every((r) => wordCount(r) >= 30);
  const currentWords = wordCount(responses[currentQ]);
  const answered = responses.filter((r) => wordCount(r) >= 30).length;

  // ── Submitting screen ──────────────────────────────────────────────────────
  if (phase === 'submitting') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: T.bg }}
      >
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full animate-bounce"
              style={{ backgroundColor: T.primary, animationDelay: `${i * 120}ms` }}
            />
          ))}
        </div>
        <p className="font-mono text-sm" style={{ color: T.secondary }}>
          Evaluating your responses…
        </p>
      </div>
    );
  }

  // ── Feedback screen ───────────────────────────────────────────────────────
  if (phase === 'feedback' && feedback) {
    const rColor = ratingColor(feedback.rating);
    const maxTotal = questions.length * 28;

    return (
      <div
        className="min-h-screen text-white"
        style={{
          backgroundColor: T.bg,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">

          {/* ── Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: T.primary }}>
                GenAI Fluency Assessment
              </span>
              <h1 className="text-4xl font-bold font-headline tracking-tight text-white mt-1">
                Session Complete
              </h1>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold font-headline" style={{ color: rColor }}>
                {feedback.totalScore}
              </div>
              <div className="text-xs font-mono mt-0.5" style={{ color: T.muted }}>
                out of {maxTotal}
              </div>
            </div>
          </div>

          {/* ── Rating band ── */}
          <div
            className="rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            style={{ background: T.surface, border: `1px solid ${T.border}` }}
          >
            <div>
              <div className="text-2xl font-bold font-headline" style={{ color: rColor }}>
                {feedback.rating}
              </div>
              <p className="text-sm mt-1" style={{ color: T.secondary }}>
                {feedback.rating === 'Exceptional' && 'Advanced, thoughtful, and responsible GenAI fluency. Strong hire signal.'}
                {feedback.rating === 'Proficient' && 'Solid, practical GenAI user with good judgment. Clear areas to develop.'}
                {feedback.rating === 'Developing' && 'Uses GenAI tools but lacks depth in evaluation, risk, or ethics. Needs coaching.'}
                {feedback.rating === 'Insufficient' && 'Surface-level familiarity only. Not yet ready for a role requiring GenAI competency.'}
              </p>
            </div>
            <div className="font-mono text-sm" style={{ color: T.muted }}>
              {Math.round(elapsed / 60)}m {elapsed % 60}s · {questions.length} questions
            </div>
          </div>

          {/* ── Red flags ── */}
          {feedback.hasRedFlags && (
            <div
              className="rounded-xl p-5 space-y-2"
              style={{ background: 'rgba(159,5,25,0.08)', border: '1px solid rgba(215,56,59,0.25)' }}
            >
              <div className="flex items-center gap-2 text-sm font-bold font-headline uppercase tracking-widest" style={{ color: '#d7383b' }}>
                <IconFlag /> Red Flags Identified
              </div>
              {feedback.redFlagDetails.map((flag, i) => (
                <p key={i} className="text-sm pl-6" style={{ color: 'rgba(215,56,59,0.85)' }}>
                  {flag}
                </p>
              ))}
            </div>
          )}

          {/* ── Aggregate score matrix ── */}
          <div
            className="rounded-xl p-6"
            style={{ background: T.surface, border: `1px solid ${T.border}` }}
          >
            <h2 className="font-headline font-bold text-sm uppercase tracking-widest mb-5" style={{ color: T.secondary }}>
              Aggregate Score Matrix
            </h2>
            <div className="space-y-3">
              {CRITERIA_META.map((c) => (
                <div key={c.key} className="flex items-center gap-4">
                  <span className="text-xs font-mono w-40 shrink-0" style={{ color: T.secondary }}>
                    {c.label}
                  </span>
                  <ScoreBar score={feedback.aggregateScores[c.key]} />
                  <span className="text-[10px] font-mono w-5 shrink-0" style={{ color: T.dimmed }}>/ 4</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Per-question breakdown ── */}
          <div className="space-y-4">
            <h2 className="font-headline font-bold text-sm uppercase tracking-widest" style={{ color: T.secondary }}>
              Per-Question Breakdown
            </h2>
            {questions.map((q, i) => {
              const result = feedback.questionResults[i];
              const isOpen = expandedQ === i;
              if (!result) return null;
              return (
                <div key={q.id} className="rounded-xl overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                  <button
                    onClick={() => setExpandedQ(isOpen ? null : i)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-[#1a191b] transition-colors focus:outline-none"
                  >
                    <div className="flex items-start gap-4 min-w-0">
                      <span className="font-mono text-xs shrink-0 mt-0.5" style={{ color: T.dimmed }}>
                        Q{i + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono uppercase tracking-widest mb-1" style={{ color: T.primary }}>
                          {q.category}
                        </div>
                        <p className="text-sm text-white/80 line-clamp-2 leading-relaxed">
                          {q.question}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xl font-bold font-headline" style={{ color: scoreColor(result.totalScore / 7) }}>
                          {result.totalScore}
                        </div>
                        <div className="text-[10px] font-mono" style={{ color: T.dimmed }}>/28</div>
                      </div>
                      <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t space-y-5" style={{ borderColor: T.border }}>
                      {/* Response excerpt */}
                      <div className="pt-4">
                        <div className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: T.dimmed }}>
                          Your Response
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: T.secondary }}>
                          {responses[i] || <span className="italic" style={{ color: T.dimmed }}>No response provided</span>}
                        </p>
                      </div>

                      {/* Scores */}
                      <div className="space-y-2">
                        {CRITERIA_META.map((c) => (
                          <div key={c.key} className="flex items-center gap-4">
                            <span className="text-xs font-mono w-40 shrink-0" style={{ color: T.secondary }}>
                              {c.label}
                            </span>
                            <ScoreBar score={result.scores[c.key]} />
                            <span className="text-[10px] font-mono w-5 shrink-0" style={{ color: T.dimmed }}>/4</span>
                          </div>
                        ))}
                      </div>

                      {/* Notes */}
                      {result.notes && (
                        <div
                          className="p-4 rounded-lg text-sm leading-relaxed"
                          style={{ background: 'rgba(155,255,206,0.04)', border: '1px solid rgba(155,255,206,0.1)', color: T.secondary }}
                        >
                          {result.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Strengths & Improvements ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedback.keyStrengths?.length > 0 && (
              <div className="rounded-xl p-5 space-y-3" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                <div className="flex items-center gap-2 text-xs font-bold font-headline uppercase tracking-widest" style={{ color: T.primary }}>
                  <IconStar /> Key Strengths
                </div>
                <ul className="space-y-2">
                  {feedback.keyStrengths.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      <span className="font-mono shrink-0" style={{ color: T.primary }}>
                        {String(i + 1).padStart(2, '0')}.
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {feedback.keyImprovements?.length > 0 && (
              <div className="rounded-xl p-5 space-y-3" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                <div className="flex items-center gap-2 text-xs font-bold font-headline uppercase tracking-widest" style={{ color: '#ac8aff' }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                  To Improve
                </div>
                <ul className="space-y-2">
                  {feedback.keyImprovements.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      <span className="font-mono shrink-0" style={{ color: '#ac8aff' }}>
                        {String(i + 1).padStart(2, '0')}.
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Closing note ── */}
          {feedback.closingNote && (
            <blockquote
              className="text-sm italic leading-relaxed pl-4 border-l-2"
              style={{ color: T.secondary, borderColor: T.primary }}
            >
              {feedback.closingNote}
            </blockquote>
          )}

          {/* ── CTAs ── */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={() => router.push('/problems?tab=fluency')}
              className="flex-1 px-6 py-3 font-bold font-headline rounded-md text-sm transition-all hover:brightness-110 active:scale-[0.98]"
              style={{ background: T.primary, color: '#001f14' }}
            >
              Return to Library
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-6 py-3 font-bold font-headline rounded-md text-sm border transition-all hover:bg-white/5"
              style={{ borderColor: T.border, color: T.secondary }}
            >
              New Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Interview screen ───────────────────────────────────────────────────────

  const q = questions[currentQ];
  const isLast = currentQ === questions.length - 1;

  return (
    <div
      className="min-h-screen flex flex-col text-white"
      style={{
        backgroundColor: T.bg,
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* ── Top bar ── */}
      <header
        className="shrink-0 flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: T.border, background: T.surface }}
      >
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: T.primary }}>
            GenAI Fluency
          </span>
          <div className="flex items-center gap-1.5">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className="w-7 h-7 rounded text-[10px] font-mono font-bold transition-all"
                style={{
                  background: i === currentQ
                    ? T.primary
                    : wordCount(responses[i]) >= 30 ? 'rgba(155,255,206,0.1)' : T.surfaceHigh,
                  color: i === currentQ ? '#001f14' : wordCount(responses[i]) >= 30 ? T.primary : T.muted,
                  border: `1px solid ${i === currentQ ? T.primary : T.border}`,
                }}
              >
                {wordCount(responses[i]) >= 30 ? '✓' : i + 1}
              </button>
            ))}
          </div>
          <span className="text-xs font-mono" style={{ color: T.muted }}>
            {answered}/{questions.length} answered
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-sm" style={{ color: T.muted }}>{formatTime(elapsed)}</span>
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="px-4 py-1.5 rounded text-xs font-bold font-mono transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: allAnswered ? T.primary : 'transparent',
              color: allAnswered ? '#001f14' : T.muted,
              border: `1px solid ${allAnswered ? T.primary : T.border}`,
            }}
          >
            Submit All
          </button>
        </div>
      </header>

      {/* ── Two-column body ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Left: Question + response ── */}
        <div className="flex-1 flex flex-col overflow-y-auto px-6 py-10 gap-8">

          {/* Category + question number */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded"
                style={{ background: 'rgba(155,255,206,0.08)', color: T.primary, border: '1px solid rgba(155,255,206,0.15)' }}
              >
                {q.category}
              </span>
              <span className="font-mono text-xs" style={{ color: T.dimmed }}>
                Question {currentQ + 1} of {questions.length}
              </span>
            </div>

            <p className="text-lg leading-relaxed text-white/90 font-headline">
              {q.question}
            </p>

            <p className="text-xs font-mono" style={{ color: T.dimmed }}>
              Use the STAR format: <span style={{ color: T.muted }}>Situation → Task → Action → Result</span>
            </p>
          </div>

          {/* Textarea */}
          <div className="flex-1 flex flex-col gap-2">
            <textarea
              value={responses[currentQ]}
              onChange={(e) => {
                const updated = [...responses];
                updated[currentQ] = e.target.value;
                setResponses(updated);
              }}
              placeholder="Describe a specific situation from your experience…"
              className="flex-1 w-full rounded-lg p-5 text-sm leading-relaxed resize-none focus:outline-none transition-colors"
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                color: T.white,
                minHeight: '260px',
                caretColor: T.primary,
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(155,255,206,0.35)'; }}
              onBlur={(e) => { e.target.style.borderColor = T.border; }}
            />
            <div className="flex justify-between items-center">
              <span
                className="text-[11px] font-mono"
                style={{ color: currentWords >= 30 ? T.primary : T.dimmed }}
              >
                {currentWords} words {currentWords < 30 && `· ${30 - currentWords} more to unlock submission`}
                {currentWords >= 30 && '· minimum met'}
              </span>
              {currentWords >= 30 && (
                <span className="text-[11px] font-mono flex items-center gap-1" style={{ color: T.primary }}>
                  <IconCheck /> Ready
                </span>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm font-mono px-4 py-2 rounded-lg" style={{ background: 'rgba(159,5,25,0.1)', color: '#d7383b', border: '1px solid rgba(215,56,59,0.2)' }}>
              {error}
            </p>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentQ((v) => Math.max(0, v - 1))}
              disabled={currentQ === 0}
              className="flex items-center gap-2 px-4 py-2 rounded text-sm font-mono disabled:opacity-20 transition-all hover:bg-white/5"
              style={{ color: T.secondary, border: `1px solid ${T.border}` }}
            >
              <IconArrowLeft /> Previous
            </button>

            {!isLast ? (
              <button
                onClick={() => setCurrentQ((v) => Math.min(questions.length - 1, v + 1))}
                className="flex items-center gap-2 px-4 py-2 rounded text-sm font-mono transition-all"
                style={{ background: T.surfaceHigh, color: T.white, border: `1px solid ${T.border}` }}
              >
                Next <IconArrowRight />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="flex items-center gap-2 px-5 py-2 rounded text-sm font-bold font-mono transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: allAnswered ? T.primary : T.surfaceHigh,
                  color: allAnswered ? '#001f14' : T.muted,
                }}
              >
                Submit All <IconArrowRight />
              </button>
            )}
          </div>
        </div>

        {/* ── Right: Clarifying chat ── */}
        <div
          className="w-80 shrink-0 flex flex-col border-l"
          style={{ borderColor: T.border, background: T.surface }}
        >
          {/* Chat header */}
          <div
            className="shrink-0 px-4 py-3 border-b"
            style={{ borderColor: T.border }}
          >
            <div className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: T.primary }}>
              Ask a clarifying question
            </div>
            <p className="text-[11px] mt-0.5" style={{ color: T.muted }}>
              Ask the AI to explain the question or what a strong answer looks like.
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatHistory.length === 0 && (
              <p className="text-[11px] font-mono text-center mt-6" style={{ color: T.dimmed }}>
                No messages yet. Ask anything about the question.
              </p>
            )}
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[90%] text-xs leading-relaxed px-3 py-2 rounded-lg"
                  style={
                    msg.role === 'user'
                      ? { background: 'rgba(155,255,206,0.12)', color: T.white, border: '1px solid rgba(155,255,206,0.2)' }
                      : { background: T.surfaceHigher, color: T.secondary, border: `1px solid ${T.border}` }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div
                  className="px-3 py-2 rounded-lg flex items-center gap-1.5"
                  style={{ background: T.surfaceHigher, border: `1px solid ${T.border}` }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ backgroundColor: T.muted, animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input */}
          <div
            className="shrink-0 p-3 border-t"
            style={{ borderColor: T.border }}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
                }}
                placeholder="Ask a question…"
                className="flex-1 rounded px-3 py-2 text-xs focus:outline-none transition-colors"
                style={{
                  background: T.surfaceHigher,
                  border: `1px solid ${T.border}`,
                  color: T.white,
                  caretColor: T.primary,
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(155,255,206,0.3)'; }}
                onBlur={(e) => { e.target.style.borderColor = T.border; }}
              />
              <button
                onClick={sendChatMessage}
                disabled={!chatInput.trim() || chatLoading}
                className="px-3 py-2 rounded text-xs font-bold font-mono transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: chatInput.trim() && !chatLoading ? T.primary : T.surfaceHigher,
                  color: chatInput.trim() && !chatLoading ? '#001f14' : T.muted,
                  border: `1px solid ${chatInput.trim() && !chatLoading ? T.primary : T.border}`,
                }}
              >
                <IconArrowRight />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
