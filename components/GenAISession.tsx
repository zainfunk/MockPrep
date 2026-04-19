'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { GenAIProblem } from '@/lib/genaiProblems';
import {
  saveSession as persistSession,
  loadSession as loadPersistedSession,
  clearSession as clearPersistedSession,
} from '@/lib/sessionPersistence';

interface PersistedGenAISession {
  sessionId: string;
  messages: Message[];
  code: string;
  language: 'python' | 'javascript';
  timeElapsed: number;
}

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message { role: 'user' | 'assistant'; content: string; }

type Segment = { type: 'text'; content: string } | { type: 'code'; content: string; lang: string };

function splitMessage(content: string): Segment[] {
  const parts: Segment[] = [];
  const regex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) parts.push({ type: 'text', content: content.slice(lastIndex, match.index) });
    parts.push({ type: 'code', content: match[2], lang: match[1] || '' });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) parts.push({ type: 'text', content: content.slice(lastIndex) });
  return parts;
}

interface PromptEvent { timestamp: number; userMessage: string; aiResponse: string; }

interface RunOutput {
  stdout: string | null; stderr: string | null; compile_output: string | null;
  status: { description: string } | null; time: string | null; memory: number | null;
}

interface GenAIFeedbackData {
  promptQualityScore: number; promptQualityExplanation: string;
  outputValidationScore: number; outputValidationExplanation: string;
  humanJudgmentScore: number; humanJudgmentExplanation: string;
  accountabilityScore: number; accountabilityExplanation: string;
  fluencyLevel: 'Concern' | 'Mild Concern' | 'Mixed' | 'Mild Strength' | 'Strength';
  averageScore: number; keyMoments: string[]; topImprovements: string[]; closingNote: string;
}

interface GenAISessionRecord {
  id: string; date: string; problemId: string; problemTitle: string; difficulty: string;
  category: string; duration: number; promptCount: number; ranCode: boolean;
  finalCode: string; lastAiCodeBlock: string | null; codeMatchesAI: boolean;
  codeModifiedFromAI: boolean; promptEvents: PromptEvent[];
  scores: { promptQuality: number; outputValidation: number; humanJudgment: number; accountability: number };
  fluencyLevel: string; averageScore: number; promptQualityExplanation: string;
  outputValidationExplanation: string; humanJudgmentExplanation: string;
  accountabilityExplanation: string; keyMoments: string[]; topImprovements: string[]; closingNote: string;
}

// ─── Design Tokens ────────────────────────────────────────────────────────────

const T = {
  surface: '#0e0e0f', surfaceLow: '#131314', surfaceMid: '#1a191b',
  surfaceHigh: '#201f21', surfaceTop: '#262627',
  primary: '#85adff', primaryCont: '#6e9fff',
  secondary: '#ac8aff', secondaryDim: '#8455ef',
  tertiary: '#9bffce', tertiaryDim: '#58e7ab',
  error: '#ff716c', errorDim: '#d7383b',
  textPrimary: '#ffffff', textSecond: '#adaaab', textMuted: '#767576',
  outline: 'rgba(72,72,73,0.15)',
};

const FLUENCY_COLOR: Record<string, string> = {
  Strength: T.tertiary, 'Mild Strength': T.tertiaryDim,
  Mixed: '#facc15', 'Mild Concern': '#fb923c', Concern: T.error,
};


// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ label, score, explanation, accentColor, delay = 0 }: {
  label: string; score: number; explanation: string; accentColor: string; delay?: number;
}) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(5, Math.max(0, score)) / 5) * circ;

  return (
    <div style={{ background: T.surfaceMid, padding: '28px 20px', borderRadius: 8, borderTop: `4px solid ${accentColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 16 }}>
        <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={r} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="64" cy="64" r={r} fill="transparent" stroke={accentColor} strokeWidth="8"
            strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset}
            style={{ transition: `stroke-dashoffset 1s ease ${delay}ms` }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '1.875rem', color: T.textPrimary }}>{score.toFixed(1)}</span>
        </div>
      </div>
      <span style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '0.875rem', color: T.textPrimary, textAlign: 'center' }}>{label}</span>
      <p style={{ fontSize: '0.8rem', color: T.textSecond, textAlign: 'center', marginTop: 8, lineHeight: 1.5 }}>{explanation}</p>
    </div>
  );
}

// ─── Feedback Screen ──────────────────────────────────────────────────────────

function GenAIFeedbackScreen({ feedback, loading, record }: {
  feedback: GenAIFeedbackData | null; loading: boolean; record: GenAISessionRecord | null;
}) {
  const router = useRouter();

  if (loading || !feedback || !record) {
    return (
      <div style={{ minHeight: 'calc(100vh - 56px)', background: T.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-inter), sans-serif' }}>
        <style>{`@keyframes spin-ring { from{transform:rotate(-90deg)}to{transform:rotate(270deg)} }`}</style>
        <div style={{ textAlign: 'center' }}>
          <svg style={{ width: 56, height: 56, margin: '0 auto 24px', animation: 'spin-ring 1s linear infinite' }} viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="22" stroke={`${T.secondary}25`} strokeWidth="4" />
            <path d="M28 6 a22 22 0 0 1 22 22" stroke={T.secondary} strokeWidth="4" strokeLinecap="round" />
          </svg>
          <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '1.375rem', color: T.textPrimary, margin: '0 0 8px' }}>Analyzing your session</h2>
          <p style={{ fontSize: '0.875rem', color: T.textSecond, margin: '0 0 4px' }}>Reviewing your AI collaboration approach...</p>
          <p style={{ fontSize: '0.75rem', color: T.textMuted, margin: '0 0 24px' }}>This usually takes about 20 seconds.</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            {['Reviewing conversation', 'Evaluating prompt quality', 'Generating feedback'].map((step) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.6875rem', color: T.textMuted }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: T.secondary, opacity: 0.6 }} />
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const avg = feedback.averageScore;
  const fluencyColor = FLUENCY_COLOR[feedback.fluencyLevel] ?? T.primary;
  const scoreColors = [T.primary, T.secondary, T.tertiary, T.textPrimary];
  const codeNote = record.lastAiCodeBlock === null ? null
    : record.codeMatchesAI ? '⚠ Submitted AI code without modification.'
    : record.codeModifiedFromAI ? '✓ Modified AI code before submitting.' : null;

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: T.surface, overflowY: 'auto', fontFamily: 'var(--font-inter), sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
          <div>
            <span style={{ display: 'block', fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.6875rem', color: T.secondary, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Performance Review</span>
            <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '2.75rem', color: T.textPrimary, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.1 }}>Session Fluency Report</h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ padding: '6px 16px', background: `${fluencyColor}1a`, border: `1px solid ${fluencyColor}33`, borderRadius: 4, fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '1rem', color: fluencyColor }}>
              {feedback.fluencyLevel}
            </div>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5625rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Fluency level badge</span>
          </div>
        </div>

        {/* 4 score cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
          <ScoreRing label="Prompt Quality"    score={feedback.promptQualityScore}    explanation={feedback.promptQualityExplanation}    accentColor={scoreColors[0]} delay={0}   />
          <ScoreRing label="Output Validation" score={feedback.outputValidationScore} explanation={feedback.outputValidationExplanation} accentColor={scoreColors[1]} delay={120} />
          <ScoreRing label="Human Judgment"    score={feedback.humanJudgmentScore}    explanation={feedback.humanJudgmentExplanation}    accentColor={scoreColors[2]} delay={240} />
          <ScoreRing label="Accountability"    score={feedback.accountabilityScore}   explanation={feedback.accountabilityExplanation}   accentColor={scoreColors[3]} delay={360} />
        </div>

        {/* Key Moments + Improvements */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
          {feedback.keyMoments.length > 0 && (
            <div style={{ background: T.surfaceLow, padding: '24px', borderRadius: 8, border: `1px solid ${T.outline}` }}>
              <h3 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '0.875rem', color: T.textPrimary, margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" fill="none" stroke={T.primary} strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
                Key Moments
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {feedback.keyMoments.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: T.surfaceMid, borderRadius: 6 }}>
                    <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.6875rem', color: T.primary, minWidth: 20, marginTop: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                    <p style={{ fontSize: '0.8125rem', color: T.textSecond, margin: 0, lineHeight: 1.5 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {feedback.topImprovements.length > 0 && (
            <div style={{ background: T.surfaceLow, padding: '24px', borderRadius: 8, border: `1px solid ${T.outline}` }}>
              <h3 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '0.875rem', color: T.textPrimary, margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" fill="none" stroke={T.secondary} strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                Top Improvements
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {feedback.topImprovements.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', background: T.surfaceMid, borderRadius: 6 }}>
                    <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.6875rem', color: T.secondary, minWidth: 20, marginTop: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                    <p style={{ fontSize: '0.8125rem', color: T.textSecond, margin: 0, lineHeight: 1.5 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Code note */}
        {codeNote && (
          <div style={{ padding: '12px 16px', borderRadius: 6, marginBottom: 24, fontSize: '0.875rem', fontFamily: 'var(--font-jetbrains-mono), monospace', background: record.codeMatchesAI ? `${T.error}12` : `${T.tertiary}12`, color: record.codeMatchesAI ? T.error : T.tertiary, border: `1px solid ${record.codeMatchesAI ? T.error : T.tertiary}25` }}>
            {codeNote}
          </div>
        )}

        {/* Aggregate + closing */}
        <div style={{ background: `${T.secondary}12`, padding: '40px', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 36, border: `1px solid ${T.secondary}20` }}>
          <div style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '3.5rem', color: T.textPrimary, lineHeight: 1, marginBottom: 6 }}>{avg.toFixed(1)}</div>
          <div style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5625rem', color: T.secondary, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 4 }}>Aggregate Performance Quotient</div>
          <div style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.625rem', color: T.textMuted, marginBottom: 24 }}>
            {record.promptCount} prompt{record.promptCount !== 1 ? 's' : ''} · {Math.round(record.duration / 60)}m elapsed
          </div>
          <blockquote style={{ maxWidth: 560, fontStyle: 'italic', color: '#ceb9ff', background: `${T.secondary}12`, padding: '18px 24px', borderRadius: 6, border: `1px solid ${T.secondary}25`, fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
            &ldquo;{feedback.closingNote}&rdquo;
          </blockquote>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
          <button
            onClick={() => router.push('/problems')}
            style={{ padding: '13px 32px', background: T.surfaceMid, color: T.textPrimary, borderRadius: 6, border: `1px solid ${T.outline}`, fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseOver={e => (e.currentTarget.style.background = T.surfaceHigh)}
            onMouseOut={e => (e.currentTarget.style.background = T.surfaceMid)}
          >
            Return to Library
          </button>
          <button
            onClick={() => router.push('/problems?tab=genai')}
            style={{ padding: '13px 40px', background: `linear-gradient(135deg, ${T.secondary} 0%, ${T.secondaryDim} 100%)`, color: '#280067', borderRadius: 6, border: 'none', fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: `0 8px 24px ${T.secondary}30`, transition: 'transform 0.15s' }}
            onMouseOver={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
            onMouseOut={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            Next Problem
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Session ─────────────────────────────────────────────────────────────

export default function GenAISession({ problem }: { problem: GenAIProblem }) {
  const persisted = typeof window !== 'undefined'
    ? loadPersistedSession<PersistedGenAISession>('genai', problem.id)
    : null;
  const sessionIdRef = useRef<string>(
    persisted?.sessionId ??
    (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`),
  );
  const [language, setLanguage] = useState<'python' | 'javascript'>(persisted?.language ?? 'python');
  const [code, setCode] = useState(persisted?.code ?? problem.starterCode.python);
  const [messages, setMessages] = useState<Message[]>(persisted?.messages ?? []);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const MAX_RUNS = 5;
  const RUNS_STORAGE_KEY = `placed_genai_runs_${problem.id}`;
  const RUNS_SESSION_MS = 45 * 60 * 1000;
  const [runsUsed, setRunsUsed] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const raw = localStorage.getItem(RUNS_STORAGE_KEY);
      if (raw) {
        const { ts, count } = JSON.parse(raw);
        if (typeof ts === 'number' && typeof count === 'number' && Date.now() - ts < RUNS_SESSION_MS) {
          return Math.min(count, MAX_RUNS);
        }
      }
    } catch {}
    return 0;
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (runsUsed === 0) return;
    try { localStorage.setItem(RUNS_STORAGE_KEY, JSON.stringify({ ts: Date.now(), count: runsUsed })); } catch {}
  }, [runsUsed, RUNS_STORAGE_KEY]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [runOutput, setRunOutput] = useState<RunOutput | null>(null);
  const [outputOpen, setOutputOpen] = useState(false);
  const [outputHeight, setOutputHeight] = useState(280);
  const isODragging = useRef(false);
  const dragStartOY = useRef(0);
  const dragStartOHeight = useRef(280);
  const [feedback, setFeedback] = useState<GenAIFeedbackData | null>(null);
  const [sessionRecord, setSessionRecord] = useState<GenAISessionRecord | null>(null);
  const [promptCount, setPromptCount] = useState(0);

  const [chatWidth, setChatWidth] = useState(340);
  const [problemHeight, setProblemHeight] = useState(220);

  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(340);
  const isVDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(220);

  const promptEventsRef = useRef<PromptEvent[]>([]);
  const lastAiCodeBlockRef = useRef<string | null>(null);
  const hasRanCodeRef = useRef(false);
  const sessionStartTimeRef = useRef(Date.now() - (persisted?.timeElapsed ?? 0) * 1000);
  const timeElapsedRef = useRef(persisted?.timeElapsed ?? 0);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef<Set<number>>(new Set());

  const [isMobile, setIsMobile] = useState(false);
  const [activeMobilePane, setActiveMobilePane] = useState<'problem' | 'chat' | 'code'>('chat');
  const mobileScrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (feedback) return;
    const handle = setTimeout(() => {
      persistSession<PersistedGenAISession>('genai', problem.id, {
        sessionId: sessionIdRef.current,
        messages,
        code,
        language,
        timeElapsed: timeElapsedRef.current,
      });
    }, 500);
    return () => clearTimeout(handle);
  }, [messages, code, language, feedback, problem.id]);

  const handleLanguageChange = (lang: 'python' | 'javascript') => {
    setLanguage(lang);
    setCode(problem.starterCode[lang]);
  };

  const handleDividerMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = chatWidth;
    e.preventDefault();
    const move = (ev: MouseEvent) => { if (!isDragging.current) return; setChatWidth(Math.min(600, Math.max(240, dragStartWidth.current + ev.clientX - dragStartX.current))); };
    const up = () => { isDragging.current = false; window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }, [chatWidth]);

  const handleVerticalDividerMouseDown = useCallback((e: React.MouseEvent) => {
    isVDragging.current = true;
    dragStartY.current = e.clientY;
    dragStartHeight.current = problemHeight;
    e.preventDefault();
    const move = (ev: MouseEvent) => { if (!isVDragging.current) return; setProblemHeight(Math.min(500, Math.max(80, dragStartHeight.current + ev.clientY - dragStartY.current))); };
    const up = () => { isVDragging.current = false; window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }, [problemHeight]);

  const handleOutputDividerMouseDown = useCallback((e: React.MouseEvent) => {
    isODragging.current = true;
    dragStartOY.current = e.clientY;
    dragStartOHeight.current = outputHeight;
    e.preventDefault();
    const move = (ev: MouseEvent) => { if (!isODragging.current) return; setOutputHeight(Math.min(600, Math.max(80, dragStartOHeight.current - (ev.clientY - dragStartOY.current)))); };
    const up = () => { isODragging.current = false; window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  }, [outputHeight]);

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
        body: JSON.stringify({ sessionId: sessionIdRef.current, messages: newMessages, problemTitle: problem.title, problemDescription: problem.description, code, language }),
      });
      if (!res.body) throw new Error('No response body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => { const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: accumulated }; return u; });
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

  const handleRunCode = async () => {
    if (isRunning) return;
    if (runsUsed >= MAX_RUNS) {
      setOutputOpen(true);
      setRunOutput({ stdout: null, stderr: `Run limit reached (${MAX_RUNS}/session). No runs remaining.`, compile_output: null, status: { description: 'Limit Reached' }, time: null, memory: null });
      return;
    }
    setIsRunning(true);
    setOutputOpen(true);
    setRunOutput(null);
    hasRanCodeRef.current = true;
    setRunsUsed((n) => n + 1);
    try {
      const res = await fetch('/api/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sessionIdRef.current, code, language }),
      });
      const data = await res.json();
      setRunOutput(res.ok ? data : { stdout: null, stderr: data.error ?? 'Unknown error', compile_output: null, status: { description: 'Error' }, time: null, memory: null });
    } catch {
      setRunOutput({ stdout: null, stderr: 'Network error.', compile_output: null, status: { description: 'Error' }, time: null, memory: null });
    } finally {
      setIsRunning(false);
    }
  };

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
        body: JSON.stringify({ sessionId: sessionIdRef.current, problemTitle: problem.title, problemDescription: problem.description, promptEvents: promptEventsRef.current, finalCode: code, lastAiCodeBlock, ranCode: hasRanCodeRef.current, codeMatchesAI, codeModifiedFromAI, promptCount: promptEventsRef.current.length, duration }),
      });
      const feedbackData: GenAIFeedbackData = await res.json();
      if (!res.ok) throw new Error((feedbackData as { error?: string }).error ?? 'Failed to get feedback.');
      const record: GenAISessionRecord = {
        id: crypto.randomUUID(), date: new Date().toISOString(),
        problemId: problem.id, problemTitle: problem.title, difficulty: problem.difficulty, category: problem.category,
        duration, promptCount: promptEventsRef.current.length, ranCode: hasRanCodeRef.current,
        finalCode: code, lastAiCodeBlock, codeMatchesAI, codeModifiedFromAI,
        promptEvents: promptEventsRef.current,
        scores: { promptQuality: feedbackData.promptQualityScore, outputValidation: feedbackData.outputValidationScore, humanJudgment: feedbackData.humanJudgmentScore, accountability: feedbackData.accountabilityScore },
        fluencyLevel: feedbackData.fluencyLevel, averageScore: feedbackData.averageScore,
        promptQualityExplanation: feedbackData.promptQualityExplanation,
        outputValidationExplanation: feedbackData.outputValidationExplanation,
        humanJudgmentExplanation: feedbackData.humanJudgmentExplanation,
        accountabilityExplanation: feedbackData.accountabilityExplanation,
        keyMoments: feedbackData.keyMoments, topImprovements: feedbackData.topImprovements, closingNote: feedbackData.closingNote,
      };
      const existing = JSON.parse(localStorage.getItem('genai_sessions') ?? '[]');
      localStorage.setItem('genai_sessions', JSON.stringify([record, ...existing]));
      clearPersistedSession('genai', problem.id);
      fetch('/api/sessions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'genai', session: record }) })
        .then(async (r) => {
          if (!r.ok) {
            const body = await r.json().catch(() => ({}));
            console.error('[GenAISession] /api/sessions POST failed:', r.status, body);
          }
        })
        .catch((err) => console.error('[GenAISession] /api/sessions POST network error:', err));
      setSessionRecord(record);
      setFeedback(feedbackData);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to get feedback.');
    } finally {
      setIsSubmitting(false);
      setLoadingFeedback(false);
    }
  };

  if (loadingFeedback || feedback) {
    return <GenAIFeedbackScreen feedback={feedback} loading={loadingFeedback} record={sessionRecord} />;
  }

  const diffColor = problem.difficulty === 'easy' ? T.tertiary : problem.difficulty === 'medium' ? '#facc15' : T.errorDim;
  const diffBg = problem.difficulty === 'easy' ? 'rgba(155,255,206,0.08)' : problem.difficulty === 'medium' ? 'rgba(250,204,21,0.08)' : 'rgba(215,56,59,0.08)';
  const diffBorder = problem.difficulty === 'easy' ? 'rgba(155,255,206,0.2)' : problem.difficulty === 'medium' ? 'rgba(250,204,21,0.2)' : 'rgba(215,56,59,0.2)';

  return (
    <div style={{ height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: T.surface }}>
      <style>{`
        .s-dot-grid { background-image: radial-gradient(circle, #262627 1px, transparent 1px); background-size: 24px 24px; }
        .chat-glass { background: rgba(26,25,27,0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .typing-dot { width: 5px; height: 5px; border-radius: 50%; background: ${T.secondary}; animation: t-bounce 1.4s ease-in-out infinite; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes t-bounce { 0%,80%,100%{transform:scale(0.5);opacity:0.3}40%{transform:scale(1);opacity:1} }
        .hdiv:hover { background: ${T.secondary} !important; }
        .vdiv:hover { background: ${T.secondary} !important; }
        .submit-btn:hover { opacity: 0.88 !important; }
        .run-btn:hover { opacity: 0.85 !important; }
      `}</style>

      {/* Sub-header */}
      <div style={{ height: 52, background: 'rgba(19,19,20,0.92)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${T.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: `${T.secondary}20`, borderRadius: 4, border: `1px solid ${T.secondary}30` }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: T.secondary, boxShadow: `0 0 6px ${T.secondary}` }} />
            <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5625rem', color: T.secondary, textTransform: 'uppercase', letterSpacing: '0.1em' }}>GenAI Coding</span>
          </div>
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '0.875rem', color: T.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 320 }}>{problem.title}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: T.surfaceHigh, borderRadius: 4 }}>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.6875rem', color: T.textSecond, fontWeight: 500 }}>{promptCount}</span>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5625rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>prompts</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: T.surfaceLow, borderRadius: 4, border: `1px solid ${T.outline}` }}>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Language</span>
            {(['python', 'javascript'] as const).map((lang) => (
              <button key={lang} onClick={() => handleLanguageChange(lang)} style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.6875rem', color: language === lang ? T.secondary : T.textMuted, background: 'transparent', border: 'none', cursor: 'pointer', padding: '1px 4px', borderBottom: language === lang ? `1px solid ${T.secondary}` : '1px solid transparent' }}>
                {lang === 'python' ? 'Python 3.11' : 'JavaScript'}
              </button>
            ))}
          </div>
          <button
            className="run-btn"
            onClick={handleRunCode}
            disabled={isRunning || runsUsed >= MAX_RUNS}
            style={{ padding: '6px 14px', fontSize: '0.75rem', fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 600, color: T.tertiary, background: `${T.tertiary}18`, borderRadius: 4, border: 'none', cursor: isRunning ? 'wait' : runsUsed >= MAX_RUNS ? 'not-allowed' : 'pointer', opacity: isRunning || runsUsed >= MAX_RUNS ? 0.5 : 1, transition: 'opacity 0.15s' }}
          >
            {isRunning ? 'Running…' : `▶ Run (${MAX_RUNS - runsUsed}/${MAX_RUNS})`}
          </button>
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={isSubmitting || promptCount === 0}
            style={{ padding: '6px 18px', fontSize: '0.75rem', fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, color: '#280067', background: `linear-gradient(135deg, ${T.secondary} 0%, ${T.secondaryDim} 100%)`, borderRadius: 4, border: 'none', cursor: (isSubmitting || promptCount === 0) ? 'not-allowed' : 'pointer', opacity: (isSubmitting || promptCount === 0) ? 0.4 : 1, boxShadow: `0 4px 14px ${T.secondary}30`, transition: 'opacity 0.15s' }}
          >
            {isSubmitting ? 'Submitting…' : 'Submit / Run Code'}
          </button>
        </div>
      </div>

      {submitError && (
        <div style={{ background: `${T.errorDim}18`, borderBottom: `1px solid ${T.errorDim}40`, padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: '0.8125rem', color: T.errorDim }}>
            Submit failed: {submitError}
          </span>
          <button onClick={() => setSubmitError(null)} style={{ background: 'transparent', border: 'none', color: T.errorDim, cursor: 'pointer', fontSize: '0.75rem', padding: '2px 8px', opacity: 0.7 }}>
            dismiss
          </button>
        </div>
      )}

      {/* Mobile tab bar */}
      {isMobile && (
        <div style={{ display: 'flex', borderBottom: `1px solid ${T.outline}`, background: T.surfaceLow, flexShrink: 0 }}>
          {(['problem', 'chat', 'code'] as const).map((pane) => (
            <button
              key={pane}
              onClick={() => {
                setActiveMobilePane(pane);
                const scroller = mobileScrollRef.current;
                if (!scroller) return;
                const idx = pane === 'problem' ? 0 : pane === 'chat' ? 1 : 2;
                scroller.scrollTo({ left: scroller.clientWidth * idx, behavior: 'smooth' });
              }}
              style={{
                flex: 1,
                padding: '10px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: activeMobilePane === pane ? `2px solid ${T.primary}` : '2px solid transparent',
                color: activeMobilePane === pane ? T.textPrimary : T.textMuted,
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              {pane}
            </button>
          ))}
        </div>
      )}

      {/* Split pane */}
      <div
        ref={mobileScrollRef}
        className="s-dot-grid"
        onScroll={() => {
          if (!isMobile) return;
          const scroller = mobileScrollRef.current;
          if (!scroller) return;
          const idx = Math.round(scroller.scrollLeft / scroller.clientWidth);
          const next = idx === 0 ? 'problem' : idx === 1 ? 'chat' : 'code';
          setActiveMobilePane((prev) => (prev === next ? prev : next));
        }}
        style={{
          flex: 1,
          display: 'flex',
          overflow: isMobile ? 'auto hidden' : 'hidden',
          scrollSnapType: isMobile ? 'x mandatory' : undefined,
          WebkitOverflowScrolling: 'touch',
        }}
      >

        {/* Chat */}
        <div style={{
          width: isMobile ? '100vw' : chatWidth,
          minWidth: isMobile ? '100vw' : undefined,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          background: T.surfaceLow,
          borderRight: isMobile ? 'none' : `1px solid ${T.outline}`,
          scrollSnapAlign: isMobile ? 'start' : undefined,
          scrollSnapStop: isMobile ? 'always' : undefined,
          order: isMobile ? 2 : 1,
        }}>
          <div style={{ padding: '13px 18px', borderBottom: `1px solid ${T.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.secondary, boxShadow: `0 0 8px ${T.secondary}` }} />
              <span style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em', color: T.textPrimary }}>GENAI_FLUENCY_ENGINE</span>
            </div>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>v4.2-stable</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.length === 0 && (
              <p style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.6875rem', color: T.textMuted, fontStyle: 'italic', lineHeight: 1.6 }}>
                Ask the AI for help — request code, explanations, or edge cases.
              </p>
            )}
            {messages.map((msg, i) => {
              const isNew = !animatedRef.current.has(i);
              if (isNew && msg.content) animatedRef.current.add(i);
              return (
                <div key={i} className={isNew && msg.content ? 'fade-in' : ''} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 4 }}>
                  {msg.role === 'user' ? (
                    <div style={{ background: T.surfaceMid, borderRadius: '10px 10px 2px 10px', padding: '10px 14px', maxWidth: '90%', borderTop: `2px solid ${T.primary}` }}>
                      <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: T.textPrimary, margin: 0 }}>{msg.content}</p>
                    </div>
                  ) : (
                    <div className="chat-glass" style={{ borderRadius: '10px 10px 10px 2px', padding: '10px 14px', maxWidth: '90%', borderTop: `2px solid ${T.secondary}`, borderRight: `1px solid ${T.outline}`, borderBottom: `1px solid ${T.outline}`, borderLeft: `1px solid ${T.outline}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {!msg.content && isStreaming && i === messages.length - 1 ? (
                        <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: T.textPrimary, margin: 0 }}>▌</p>
                      ) : (
                        splitMessage(msg.content).map((seg, si) => (
                          seg.type === 'text' ? (
                            seg.content.trim() && (
                              <p key={si} style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: T.textPrimary, margin: 0, whiteSpace: 'pre-wrap' }}>{seg.content}</p>
                            )
                          ) : (
                            <div key={si} style={{ background: T.surface, borderRadius: 6, border: `1px solid ${T.outline}`, overflow: 'hidden' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 10px', background: T.surfaceLow, borderBottom: `1px solid ${T.outline}` }}>
                                <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5625rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{seg.lang || 'code'}</span>
                                <div style={{ display: 'flex', gap: 8 }}>
                                  <button
                                    onClick={() => navigator.clipboard.writeText(seg.content)}
                                    style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5625rem', color: T.textMuted, background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '2px 4px' }}
                                  >Copy</button>
                                  <button
                                    onClick={() => { setCode(seg.content); hasRanCodeRef.current = false; }}
                                    style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: '0.625rem', fontWeight: 600, color: '#280067', background: T.secondary, border: 'none', borderRadius: 3, cursor: 'pointer', padding: '3px 8px' }}
                                  >→ Insert into Editor</button>
                                </div>
                              </div>
                              <pre style={{ margin: 0, padding: '10px 12px', fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.75rem', color: T.tertiary, overflowX: 'auto', lineHeight: 1.55 }}>{seg.content}</pre>
                            </div>
                          )
                        ))
                      )}
                    </div>
                  )}
                  <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5rem', color: msg.role === 'user' ? T.textMuted : T.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {msg.role === 'user' ? 'You' : 'ARCHITECT_AI'}
                  </span>
                </div>
              );
            })}
            {isStreaming && messages[messages.length - 1]?.content === '' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.6 }}>
                <div style={{ display: 'flex', gap: 3 }}><div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/></div>
                <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>ANALYZING CODE ARCHITECTURE...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          <div style={{ padding: '12px 14px', background: T.surfaceMid }}>
            <div style={{ position: 'relative' }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Discuss architecture or ask for a hint..."
                disabled={isStreaming}
                rows={6}
                style={{ width: '100%', background: T.surface, border: `1px solid ${T.outline}`, borderRadius: 8, padding: '10px 44px 10px 12px', fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.8rem', color: T.textPrimary, outline: 'none', resize: 'none', boxSizing: 'border-box', opacity: isStreaming ? 0.5 : 1, lineHeight: 1.5 }}
              />
              <button
                onClick={sendMessage}
                disabled={isStreaming || !input.trim()}
                style={{ position: 'absolute', bottom: 8, right: 8, width: 28, height: 28, borderRadius: 4, background: T.secondary, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (isStreaming || !input.trim()) ? 0.25 : 1, transition: 'opacity 0.15s' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal drag — desktop only */}
        {!isMobile && <div className="hdiv" onMouseDown={handleDividerMouseDown} style={{ width: 3, background: T.outline, cursor: 'col-resize', flexShrink: 0, transition: 'background 0.15s' }} />}

        {/* Right: Problem + Editor + Output. On mobile, display:contents lets
            the two inner panes become direct siblings of the chat for scroll-snap. */}
        <div style={isMobile
          ? { display: 'contents' }
          : { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }
        }>

          {/* Problem */}
          <div style={{
            ...(isMobile
              ? { width: '100vw', minWidth: '100vw', flexShrink: 0, display: 'flex', flexDirection: 'column', scrollSnapAlign: 'start', scrollSnapStop: 'always', order: 1 }
              : { height: problemHeight, flexShrink: 0 }),
            overflowY: 'auto',
            padding: '16px 20px',
            background: T.surfaceLow,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: T.textPrimary, margin: 0 }}>{problem.title}</h2>
              <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: '0.5625rem', fontFamily: 'var(--font-jetbrains-mono), monospace', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', background: diffBg, color: diffColor, border: `1px solid ${diffBorder}` }}>{problem.difficulty}</span>
              <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: '0.5625rem', fontFamily: 'var(--font-jetbrains-mono), monospace', color: T.textMuted, background: T.surfaceHigh }}>{problem.category}</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: T.textSecond, lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: '0 0 10px' }}>{problem.description}</p>
            {problem.exampleOutput && (
              <div style={{ marginBottom: 10 }}>
                <p style={{ fontSize: '0.5625rem', color: T.textMuted, fontFamily: 'var(--font-jetbrains-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Example Output</p>
                <pre style={{ margin: 0, padding: '7px 12px', background: T.surface, borderRadius: 4, fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.6875rem', color: T.textSecond, overflowX: 'auto' }}>{problem.exampleOutput}</pre>
              </div>
            )}
            <div style={{ marginTop: 8, padding: '10px 14px', background: `${T.secondary}0d`, borderRadius: 6, border: `1px solid ${T.secondary}20` }}>
              <p style={{ fontSize: '0.5625rem', color: T.secondary, fontFamily: 'var(--font-jetbrains-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Scenario</p>
              <p style={{ fontSize: '0.8125rem', color: T.textSecond, lineHeight: 1.6, margin: 0 }}>{problem.scenario}</p>
            </div>
          </div>

          {/* Vertical drag — desktop only */}
          {!isMobile && <div className="vdiv" onMouseDown={handleVerticalDividerMouseDown} style={{ height: 3, background: T.outline, cursor: 'row-resize', flexShrink: 0, transition: 'background 0.15s' }} />}

          {/* Editor group — on mobile, this is its own scroll-snap pane. */}
          <div style={isMobile
            ? { width: '100vw', minWidth: '100vw', flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', scrollSnapAlign: 'start', scrollSnapStop: 'always', order: 3 }
            : { display: 'contents' }
          }>

          {/* IDE toolbar */}
          <div style={{ height: 40, background: T.surfaceLow, borderBottom: `1px solid ${T.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 40, padding: '0 8px', borderBottom: `2px solid ${T.secondary}` }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.secondary} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.6875rem', color: T.textPrimary }}>
                  solution.{language === 'python' ? 'py' : 'js'}
                </span>
              </div>
            </div>
            <button onClick={() => navigator.clipboard.writeText(code)} style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5rem', color: T.textMuted, background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Copy</button>
          </div>

          {/* Monaco */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <MonacoEditor
              height="100%"
              language={language === 'python' ? 'python' : 'javascript'}
              value={code}
              onChange={(val) => setCode(val ?? '')}
              theme="vs-dark"
              options={{ fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, wordWrap: 'on', tabSize: language === 'python' ? 4 : 2, lineNumbers: 'on', automaticLayout: true, fontFamily: "'JetBrains Mono', 'Cascadia Code', monospace", lineHeight: 22, padding: { top: 16, bottom: 8 } }}
            />
          </div>

          {/* Console output */}
          {outputOpen && (
            <>
              <div className="vdiv" onMouseDown={handleOutputDividerMouseDown} style={{ height: 4, background: T.outline, cursor: 'row-resize', flexShrink: 0, transition: 'background 0.15s' }} />
            <div style={{ borderTop: `2px solid ${T.secondary}40`, flexShrink: 0, background: T.surface, height: outputHeight, display: 'flex', flexDirection: 'column', boxShadow: '0 -8px 24px rgba(0,0,0,0.3)' }}>
              <div style={{ padding: '8px 14px', background: T.surfaceLow, borderBottom: `1px solid ${T.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textPrimary }}>Console Output</span>
                <button onClick={() => setOutputOpen(false)} style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5625rem', color: T.textMuted, background: 'none', border: 'none', cursor: 'pointer' }}>CLOSE</button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.75rem', lineHeight: 1.6 }}>
                {!runOutput ? (
                  <span style={{ color: T.textMuted }}>Running...</span>
                ) : (
                  <>
                    {runOutput.status && <div style={{ color: T.textMuted, marginBottom: 4 }}>[{runOutput.status.description}]</div>}
                    {runOutput.compile_output && <div style={{ color: T.error, whiteSpace: 'pre-wrap', marginBottom: 4 }}>{runOutput.compile_output}</div>}
                    {runOutput.stdout && <div style={{ color: T.tertiary, whiteSpace: 'pre-wrap', marginBottom: 4 }}>{runOutput.stdout}</div>}
                    {runOutput.stderr && <div style={{ color: T.errorDim, whiteSpace: 'pre-wrap', marginBottom: 4 }}>{runOutput.stderr}</div>}
                    {!runOutput.stdout && !runOutput.stderr && !runOutput.compile_output && (
                      <div style={{ color: T.textMuted, fontStyle: 'italic' }}>
                        (no output — did you {language === 'python' ? 'call print() on your result' : 'console.log() your result'}?)
                      </div>
                    )}
                    {runOutput.time && <div style={{ color: T.textMuted, marginTop: 4 }}>{runOutput.time}s{runOutput.memory ? ` · ${runOutput.memory}KB` : ''}</div>}
                  </>
                )}
              </div>
            </div>
            </>
          )}
          </div>{/* end editor group */}
        </div>
      </div>
    </div>
  );
}
