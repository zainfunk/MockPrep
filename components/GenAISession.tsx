'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { GenAIProblem } from '@/lib/genaiProblems';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// ─── Types ──────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PromptEvent {
  timestamp: number;
  userMessage: string;
  aiResponse: string;
}

interface RunOutput {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: { description: string } | null;
  time: string | null;
  memory: number | null;
}

interface GenAIFeedbackData {
  promptQualityScore: number;
  promptQualityExplanation: string;
  outputValidationScore: number;
  outputValidationExplanation: string;
  humanJudgmentScore: number;
  humanJudgmentExplanation: string;
  accountabilityScore: number;
  accountabilityExplanation: string;
  fluencyLevel: 'Concern' | 'Mild Concern' | 'Mixed' | 'Mild Strength' | 'Strength';
  averageScore: number;
  keyMoments: string[];
  topImprovements: string[];
  closingNote: string;
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
  finalCode: string;
  lastAiCodeBlock: string | null;
  codeMatchesAI: boolean;
  codeModifiedFromAI: boolean;
  promptEvents: PromptEvent[];
  scores: {
    promptQuality: number;
    outputValidation: number;
    humanJudgment: number;
    accountability: number;
  };
  fluencyLevel: string;
  averageScore: number;
  promptQualityExplanation: string;
  outputValidationExplanation: string;
  humanJudgmentExplanation: string;
  accountabilityExplanation: string;
  keyMoments: string[];
  topImprovements: string[];
  closingNote: string;
}

// ─── Score Ring (feedback screen) ────────────────────────────────────────────

function ScoreRing({
  label,
  score,
  explanation,
  delay = 0,
}: {
  label: string;
  score: number;
  explanation: string;
  delay?: number;
}) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(1, Math.max(0, score / 5));
  const dash = pct * circ;
  const color  = score >= 4 ? '#4ade80' : score >= 3 ? '#facc15' : '#f87171';
  const textColor = score >= 4 ? 'text-green-400' : score >= 3 ? 'text-yellow-400' : 'text-red-400';
  const trackColor = score >= 4 ? 'rgba(74,222,128,0.1)' : score >= 3 ? 'rgba(250,204,21,0.1)' : 'rgba(248,113,113,0.1)';

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center">
      <div className="relative w-24 h-24 mb-4">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88" aria-hidden>
          <circle cx="44" cy="44" r={r} fill="none" stroke={trackColor} strokeWidth="7" />
          <circle
            cx="44" cy="44" r={r} fill="none"
            stroke={color} strokeWidth="7" strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ transition: `stroke-dasharray 1s ease ${delay}ms` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-extrabold ${textColor}`}>{score.toFixed(1)}</span>
        </div>
      </div>
      <h3 className="text-gray-900 dark:text-white font-semibold mb-2">{label}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{explanation}</p>
    </div>
  );
}

// ─── Feedback Screen ─────────────────────────────────────────────────────────

const FLUENCY_HEADLINE: Record<string, string> = {
  Strength:        'Outstanding fluency.',
  'Mild Strength': 'Strong AI collaboration.',
  Mixed:           'Solid effort.',
  'Mild Concern':  'Room to grow.',
  Concern:         'Keep developing.',
};

const FLUENCY_PILL: Record<string, string> = {
  Strength:        'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-400 dark:border-green-500',
  'Mild Strength': 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-400 dark:border-emerald-500',
  Mixed:           'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-400 dark:border-yellow-500',
  'Mild Concern':  'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 border-orange-400 dark:border-orange-500',
  Concern:         'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-400 dark:border-red-500',
};

function GenAIFeedbackScreen({
  feedback,
  loading,
  record,
}: {
  feedback: GenAIFeedbackData | null;
  loading: boolean;
  record: GenAISessionRecord | null;
}) {
  const router = useRouter();

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading || !feedback || !record) {
    return (
      <div className="h-[calc(100vh-56px)] bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-8">
            <svg className="w-20 h-20 animate-spin" viewBox="0 0 80 80" fill="none" aria-hidden>
              <circle cx="40" cy="40" r="34" stroke="rgba(168,85,247,0.15)" strokeWidth="6" />
              <path d="M40 6 a34 34 0 0 1 34 34" stroke="#a855f7" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analyzing your session</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Reviewing your AI collaboration approach...</p>
          <p className="text-gray-400 dark:text-gray-600 text-xs mb-6">This usually takes about 20 seconds.</p>
          <div className="flex flex-col items-center gap-2 text-sm">
            {['Reviewing conversation', 'Evaluating prompt quality', 'Generating feedback'].map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-2 text-gray-500"
                style={{ animation: `pulse 1.5s ease-in-out ${i * 0.4}s infinite` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500/60" />
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Feedback ─────────────────────────────────────────────────────────────
  const avg = feedback.averageScore;
  const avgColor    = avg >= 4 ? 'text-green-400' : avg >= 3 ? 'text-yellow-400' : 'text-red-400';
  const avgStroke   = avg >= 4 ? '#4ade80'         : avg >= 3 ? '#facc15'         : '#f87171';
  const avgTrack    = avg >= 4 ? 'rgba(74,222,128,0.1)' : avg >= 3 ? 'rgba(250,204,21,0.1)' : 'rgba(248,113,113,0.1)';
  const avgR = 54;
  const avgCirc = 2 * Math.PI * avgR;
  const avgDash = (avg / 5) * avgCirc;

  const pillClass = FLUENCY_PILL[feedback.fluencyLevel] ?? FLUENCY_PILL['Mixed'];

  const codeNote = record.lastAiCodeBlock === null
    ? null
    : record.codeMatchesAI
    ? '⚠️ Submitted AI code without modification.'
    : record.codeModifiedFromAI
    ? '✓ Modified AI code before submitting.'
    : null;

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-y-auto">

      {/* ── Hero ── */}
      <div className="relative border-b border-gray-200 dark:border-gray-800/60 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 100% at 50% -10%, rgba(168,85,247,0.1) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-10">

            {/* Average score ring */}
            <div className="flex flex-col items-center shrink-0">
              <div className="relative w-36 h-36">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 132 132" aria-hidden>
                  <circle cx="66" cy="66" r={avgR} fill="none" stroke={avgTrack} strokeWidth="9" />
                  <circle
                    cx="66" cy="66" r={avgR} fill="none"
                    stroke={avgStroke} strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={`${avgDash} ${avgCirc}`}
                    style={{ transition: 'stroke-dasharray 1.2s ease 0ms' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-extrabold leading-none ${avgColor}`}>{avg.toFixed(1)}</span>
                  <span className="text-gray-500 text-xs mt-0.5">/5</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-3">Average Score</p>
            </div>

            {/* Title + fluency pill + closing note */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/20 text-purple-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                Session Complete
              </div>
              <div className="flex items-center gap-3 mb-3 justify-center lg:justify-start flex-wrap">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  {FLUENCY_HEADLINE[feedback.fluencyLevel]}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${pillClass}`}>
                  {feedback.fluencyLevel}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-lg">{feedback.closingNote}</p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                {record.promptCount} prompt{record.promptCount !== 1 ? 's' : ''} sent &nbsp;·&nbsp;
                {Math.round(record.duration / 60)}m elapsed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Score breakdown ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Score Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <ScoreRing label="Prompt Quality"     score={feedback.promptQualityScore}     explanation={feedback.promptQualityExplanation}     delay={100} />
          <ScoreRing label="Output Validation"  score={feedback.outputValidationScore}  explanation={feedback.outputValidationExplanation}  delay={250} />
          <ScoreRing label="Human Judgment"     score={feedback.humanJudgmentScore}     explanation={feedback.humanJudgmentExplanation}     delay={400} />
          <ScoreRing label="Accountability"     score={feedback.accountabilityScore}    explanation={feedback.accountabilityExplanation}    delay={550} />
        </div>

        {/* ── Details grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

          {/* Key Moments */}
          {feedback.keyMoments.length > 0 && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Key Moments</h3>
              <ol className="space-y-4">
                {feedback.keyMoments.map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="w-7 h-7 rounded-full bg-purple-600/15 border border-purple-500/25 text-purple-400 text-sm font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed pt-0.5">{item}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Top Improvements */}
          {feedback.topImprovements.length > 0 && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top Things to Improve</h3>
              <ol className="space-y-4">
                {feedback.topImprovements.map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="w-7 h-7 rounded-full bg-blue-600/15 border border-blue-500/25 text-blue-400 text-sm font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed pt-0.5">{item}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Code submission note */}
        {codeNote && (
          <div className={`rounded-2xl px-5 py-4 mb-6 border text-sm font-medium ${
            record.codeMatchesAI
              ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700/40 text-orange-700 dark:text-orange-300'
              : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/40 text-green-700 dark:text-green-300'
          }`}>
            {codeNote}
          </div>
        )}

        {/* ── CTA ── */}
        <button
          onClick={() => router.push('/problems?tab=genai')}
          className="btn-glow w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-2xl font-semibold text-base transition-colors"
        >
          Try Another GenAI Problem
        </button>
      </div>
    </div>
  );
}

// ─── Main Session ─────────────────────────────────────────────────────────────

export default function GenAISession({ problem }: { problem: GenAIProblem }) {
  const [language, setLanguage] = useState<'python' | 'javascript'>('python');
  const [code, setCode] = useState(problem.starterCode.python);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [runOutput, setRunOutput] = useState<RunOutput | null>(null);
  const [outputOpen, setOutputOpen] = useState(false);
  const [feedback, setFeedback] = useState<GenAIFeedbackData | null>(null);
  const [sessionRecord, setSessionRecord] = useState<GenAISessionRecord | null>(null);
  const [promptCount, setPromptCount] = useState(0);
  const [isDark, setIsDark] = useState(true);

  // Layout — mirrors InterviewSession
  const [chatWidth, setChatWidth] = useState(300);
  const [problemHeight, setProblemHeight] = useState(240);

  // Drag refs
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(300);
  const isVDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(240);

  // Tracking refs
  const promptEventsRef = useRef<PromptEvent[]>([]);
  const lastAiCodeBlockRef = useRef<string | null>(null);
  const hasRanCodeRef = useRef(false);
  const sessionStartTimeRef = useRef(Date.now());
  const timeElapsedRef = useRef(0);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Sync dark mode
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setIsDark(saved ? saved === 'dark' : document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLanguageChange = (lang: 'python' | 'javascript') => {
    setLanguage(lang);
    setCode(problem.starterCode[lang]);
  };

  // ── Horizontal divider ──────────────────────────────────────────────────────
  const handleDividerMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = chatWidth;
    e.preventDefault();
    const onMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      setChatWidth(Math.min(600, Math.max(200, dragStartWidth.current + ev.clientX - dragStartX.current)));
    };
    const onMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [chatWidth]);

  // ── Vertical divider ────────────────────────────────────────────────────────
  const handleVerticalDividerMouseDown = useCallback((e: React.MouseEvent) => {
    isVDragging.current = true;
    dragStartY.current = e.clientY;
    dragStartHeight.current = problemHeight;
    e.preventDefault();
    const onMouseMove = (ev: MouseEvent) => {
      if (!isVDragging.current) return;
      setProblemHeight(Math.min(500, Math.max(80, dragStartHeight.current + ev.clientY - dragStartY.current)));
    };
    const onMouseUp = () => {
      isVDragging.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [problemHeight]);

  // ── Send Message ─────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsStreaming(true);

    const eventStart = Date.now();
    let accumulated = '';

    try {
      const res = await fetch('/api/genai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, problemTitle: problem.title, problemDescription: problem.description }),
      });
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: accumulated };
          return updated;
        });
      }

      const match = accumulated.match(/```(?:\w+)?\n([\s\S]*?)```/);
      if (match) lastAiCodeBlockRef.current = match[1].trim();

      promptEventsRef.current.push({ timestamp: eventStart, userMessage: trimmed, aiResponse: accumulated });
      setPromptCount(promptEventsRef.current.length);
      timeElapsedRef.current = (Date.now() - sessionStartTimeRef.current) / 1000;
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setIsStreaming(false);
    }
  }, [input, messages, isStreaming, problem]);

  // ── Run Code ─────────────────────────────────────────────────────────────────
  const handleRunCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setOutputOpen(true);
    hasRanCodeRef.current = true;
    try {
      const res = await fetch('/api/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, languageId: problem.judgingLanguageIds[language] }),
      });
      const data = await res.json();
      setRunOutput(res.ok ? data : { stdout: null, stderr: data.error ?? 'Unknown error', compile_output: null, status: { description: 'Error' }, time: null, memory: null });
    } catch {
      setRunOutput({ stdout: null, stderr: 'Network error contacting code runner.', compile_output: null, status: { description: 'Error' }, time: null, memory: null });
    } finally {
      setIsRunning(false);
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setLoadingFeedback(true);
    setSubmitError(null);

    const lastAiCodeBlock = lastAiCodeBlockRef.current;
    const codeMatchesAI = lastAiCodeBlock !== null && code.trim() === lastAiCodeBlock;
    const codeModifiedFromAI = lastAiCodeBlock !== null && !codeMatchesAI;
    const duration = (Date.now() - sessionStartTimeRef.current) / 1000;

    try {
      const res = await fetch('/api/genai-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: { title: problem.title, description: problem.description },
          promptEvents: promptEventsRef.current,
          finalCode: code,
          lastAiCodeBlock,
          ranCode: hasRanCodeRef.current,
          codeMatchesAI,
          codeModifiedFromAI,
          promptCount: promptEventsRef.current.length,
          duration,
        }),
      });

      const feedbackData: GenAIFeedbackData = await res.json();
      if (!res.ok) throw new Error((feedbackData as { error?: string }).error ?? 'Failed to get feedback.');

      const record: GenAISessionRecord = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        problemId: problem.id,
        problemTitle: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        duration,
        promptCount: promptEventsRef.current.length,
        ranCode: hasRanCodeRef.current,
        finalCode: code,
        lastAiCodeBlock,
        codeMatchesAI,
        codeModifiedFromAI,
        promptEvents: promptEventsRef.current,
        scores: {
          promptQuality: feedbackData.promptQualityScore,
          outputValidation: feedbackData.outputValidationScore,
          humanJudgment: feedbackData.humanJudgmentScore,
          accountability: feedbackData.accountabilityScore,
        },
        fluencyLevel: feedbackData.fluencyLevel,
        averageScore: feedbackData.averageScore,
        promptQualityExplanation: feedbackData.promptQualityExplanation,
        outputValidationExplanation: feedbackData.outputValidationExplanation,
        humanJudgmentExplanation: feedbackData.humanJudgmentExplanation,
        accountabilityExplanation: feedbackData.accountabilityExplanation,
        keyMoments: feedbackData.keyMoments,
        topImprovements: feedbackData.topImprovements,
        closingNote: feedbackData.closingNote,
      };

      const existing = JSON.parse(localStorage.getItem('genai_sessions') ?? '[]');
      localStorage.setItem('genai_sessions', JSON.stringify([record, ...existing]));

      // Save to DB (fire and forget — don't block UI)
      fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'genai', session: record }),
      }).catch(() => {});

      setSessionRecord(record);
      setFeedback(feedbackData);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to get feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
      setLoadingFeedback(false);
    }
  };

  // Show loading/feedback screen once submit is triggered
  if (loadingFeedback || feedback) {
    return <GenAIFeedbackScreen feedback={feedback} loading={loadingFeedback} record={sessionRecord} />;
  }

  const border   = isDark ? 'border-gray-700' : 'border-gray-200';
  const bg900    = isDark ? 'bg-gray-900' : 'bg-white';
  const dividerCls = isDark ? 'bg-gray-700' : 'bg-gray-200';

  // ── Session UI ────────────────────────────────────────────────────────────────
  return (
    <div className={`h-[calc(100vh-56px)] flex flex-col overflow-hidden ${isDark ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Top Bar */}
      <div className={`h-14 border-b flex items-center justify-between px-4 shrink-0 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold bg-purple-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
            GenAI Fluency
          </span>
          <span className={`font-semibold truncate max-w-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>{problem.title}</span>
          <span className={`text-xs capitalize ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{problem.difficulty}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {promptCount} prompt{promptCount !== 1 ? 's' : ''} sent
          </span>
          {submitError && (
            <span className="text-red-400 text-xs">{submitError}</span>
          )}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || promptCount === 0}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            {isSubmitting ? 'Submitting…' : 'Submit'}
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: AI Chat */}
        <div
          className={`flex flex-col border-r shrink-0 ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}
          style={{ width: chatWidth }}
        >
          <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider border-b ${isDark ? 'text-purple-400 border-gray-700' : 'text-purple-600 border-gray-200'}`}>
            AI Assistant
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {messages.length === 0 && (
              <p className={`text-xs italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Ask the AI for help — request code, explanations, or edge cases.
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <span className={`text-xs mb-1 px-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {m.role === 'user' ? 'You' : 'AI'}
                </span>
                <div
                  className="max-w-[90%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap"
                  style={isDark
                    ? { backgroundColor: m.role === 'user' ? '#2a2a2a' : '#1e293b', color: '#ffffff' }
                    : { backgroundColor: m.role === 'user' ? '#e5e7eb' : '#eff6ff', color: '#111827' }
                  }
                >
                  {m.content || (isStreaming && i === messages.length - 1 ? '▌' : '')}
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>
          <div className={`p-3 border-t ${border}`}>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Ask the AI…"
                disabled={isStreaming}
                className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 disabled:opacity-50 ${
                  isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
              <button
                onClick={sendMessage}
                disabled={isStreaming || !input.trim()}
                className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                {isStreaming ? '…' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        {/* Vertical drag divider */}
        <div
          onMouseDown={handleDividerMouseDown}
          className={`w-1.5 hover:bg-purple-500 cursor-col-resize shrink-0 transition-colors ${dividerCls}`}
        />

        {/* Right: Problem + Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Problem */}
          <div className={`overflow-y-auto p-4 shrink-0 ${bg900}`} style={{ height: problemHeight }}>
            <div className="flex items-center gap-3 mb-3">
              <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{problem.title}</h2>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${
                problem.difficulty === 'easy'
                  ? isDark ? 'bg-green-900 text-green-300 border-green-700' : 'bg-green-100 text-green-700 border-green-300'
                  : problem.difficulty === 'medium'
                  ? isDark ? 'bg-yellow-900 text-yellow-300 border-yellow-700' : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                  : isDark ? 'bg-red-900 text-red-300 border-red-700' : 'bg-red-100 text-red-700 border-red-300'
              }`}>{problem.difficulty}</span>
              <span className={`px-2 py-0.5 rounded text-xs ${isDark ? 'text-gray-500 bg-gray-800' : 'text-gray-500 bg-gray-100 border border-gray-200'}`}>
                {problem.category}
              </span>
            </div>
            <p className={`text-sm whitespace-pre-wrap mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{problem.description}</p>
            {problem.exampleOutput && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-1">Example Output:</p>
                <pre className={`rounded px-2 py-1.5 font-mono text-xs ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                  {problem.exampleOutput}
                </pre>
              </div>
            )}
            <div className={`mt-2 rounded-lg p-3 border ${isDark ? 'bg-purple-950/30 border-purple-800/50' : 'bg-purple-50 border-purple-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Scenario</p>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{problem.scenario}</p>
            </div>
          </div>

          {/* Horizontal drag divider */}
          <div
            onMouseDown={handleVerticalDividerMouseDown}
            className={`h-1.5 hover:bg-purple-500 cursor-row-resize shrink-0 transition-colors ${dividerCls}`}
          />

          {/* Editor toolbar */}
          <div
            className={`flex items-center gap-2 px-3 py-2 border-b shrink-0 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
            style={{ backgroundColor: isDark ? '#1a202c' : '#f9fafb' }}
          >
            {(['python', 'javascript'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`text-sm px-3 py-1 rounded transition-colors ${
                  language === lang
                    ? 'bg-purple-600 text-white'
                    : isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'
                }`}
              >
                {lang === 'python' ? 'Python' : 'JavaScript'}
              </button>
            ))}
            <div className="flex-1" />
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="bg-green-700 hover:bg-green-600 disabled:opacity-40 text-white text-sm px-3 py-1 rounded transition-colors"
            >
              {isRunning ? 'Running…' : '▶ Run Code'}
            </button>
          </div>

          {/* Monaco */}
          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              height="100%"
              language={language === 'python' ? 'python' : 'javascript'}
              value={code}
              onChange={(val) => setCode(val ?? '')}
              theme={isDark ? 'vs-dark' : 'vs-light'}
              options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false, wordWrap: 'on', tabSize: language === 'python' ? 4 : 2, lineNumbers: 'on', automaticLayout: true }}
            />
          </div>

          {/* Run Output */}
          {outputOpen && (
            <div className="bg-gray-900 border-t border-gray-700 shrink-0" style={{ maxHeight: '180px', overflowY: 'auto' }}>
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-700">
                <span className="text-xs font-semibold text-gray-400">Output</span>
                <button onClick={() => setOutputOpen(false)} className="text-xs text-gray-500 hover:text-gray-300">✕</button>
              </div>
              {runOutput ? (
                <div className="p-3 font-mono text-xs space-y-1">
                  {runOutput.status && <p className="text-gray-500">{runOutput.status.description}</p>}
                  {runOutput.compile_output && <p className="text-red-400 whitespace-pre-wrap">{runOutput.compile_output}</p>}
                  {runOutput.stdout && <p className="text-green-400 whitespace-pre-wrap">{runOutput.stdout}</p>}
                  {runOutput.stderr && <p className="text-red-400 whitespace-pre-wrap">{runOutput.stderr}</p>}
                  {runOutput.time && <p className="text-gray-500">{runOutput.time}s{runOutput.memory ? ` · ${runOutput.memory}KB` : ''}</p>}
                </div>
              ) : (
                <div className="p-3 text-xs text-gray-500">Running…</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
