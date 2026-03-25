'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Problem } from '@/lib/problems';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

type Language = 'python' | 'javascript' | 'java' | 'cpp';

const LANGUAGE_LABELS: Record<Language, string> = {
  python: 'Python 3.11',
  javascript: 'JavaScript',
  java: 'Java',
  cpp: 'C++',
};

const MONACO_LANGUAGE_MAP: Record<Language, string> = {
  python: 'python',
  javascript: 'javascript',
  java: 'java',
  cpp: 'cpp',
};

const FILE_EXT: Record<Language, string> = {
  python: 'py',
  javascript: 'js',
  java: 'java',
  cpp: 'cpp',
};

const STUBS: Record<Language, string> = {
  python: `def solution():\n    pass`,
  javascript: `function solution() {\n  // your solution here\n}`,
  java: `class Solution {\n    public void solution() {\n        // your solution here\n    }\n}`,
  cpp: `class Solution {\npublic:\n    void solution() {\n        // your solution here\n    }\n};`,
};

const TOTAL_SECONDS = 45 * 60;

const T = {
  surface: '#0e0e0f',
  surfaceLow: '#131314',
  surfaceMid: '#1a191b',
  surfaceHigh: '#201f21',
  surfaceTop: '#262627',
  primary: '#85adff',
  primaryCont: '#6e9fff',
  secondary: '#ac8aff',
  tertiary: '#9bffce',
  error: '#ff716c',
  errorDim: '#d7383b',
  textPrimary: '#ffffff',
  textSecond: '#adaaab',
  textMuted: '#767576',
  outline: 'rgba(72,72,73,0.15)',
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface FeedbackData {
  communicationScore: number;
  communicationExplanation: string;
  problemSolvingScore: number;
  problemSolvingExplanation: string;
  codeQualityScore: number;
  codeQualityExplanation: string;
  timeManagement: string;
  topImprovements: string[];
  closingNote: string;
}

interface SessionRecord {
  id: string;
  date: string;
  problemTitle: string;
  difficulty: string;
  category: string;
  duration: string;
  scores: { communication: number; problemSolving: number; codeQuality: number };
  overallScore: number;
  topImprovements: string[];
  fullFeedback: string;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return '< 1 minute';
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
}

function saveSession(record: SessionRecord): void {
  try {
    const raw = localStorage.getItem('interview_sessions');
    const existing: SessionRecord[] = raw ? (JSON.parse(raw) as SessionRecord[]) : [];
    existing.push(record);
    localStorage.setItem('interview_sessions', JSON.stringify(existing));
  } catch { /* silent */ }
  fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'interview', session: record }),
  }).catch(() => {});
}

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ label, score, explanation, delay = 0 }: {
  label: string; score: number; explanation: string; delay?: number;
}) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(10, Math.max(0, score)) / 10) * circ;
  const color = score >= 8 ? T.tertiary : score >= 5 ? T.primary : T.errorDim;

  return (
    <div style={{ background: T.surfaceMid, padding: '28px 20px', borderRadius: 8, borderTop: `4px solid ${color}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 16 }}>
        <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={r} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle cx="64" cy="64" r={r} fill="transparent" stroke={color} strokeWidth="8"
            strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset}
            style={{ transition: `stroke-dashoffset 1s ease ${delay}ms` }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '1.875rem', color: T.textPrimary }}>{score}</span>
        </div>
      </div>
      <span style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '0.875rem', color: T.textPrimary, textAlign: 'center' }}>{label}</span>
      <p style={{ fontSize: '0.8rem', color: T.textSecond, textAlign: 'center', marginTop: 8, lineHeight: 1.5 }}>{explanation}</p>
    </div>
  );
}

// ─── FeedbackScreen ───────────────────────────────────────────────────────────

function FeedbackScreen({ feedback, loading, onRestart }: {
  feedback: FeedbackData | null; loading: boolean; onRestart: () => void;
}) {
  if (loading || !feedback) {
    return (
      <div style={{ minHeight: 'calc(100vh - 56px)', background: T.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-inter), sans-serif' }}>
        <style>{`@keyframes spin-ring { from { transform: rotate(-90deg); } to { transform: rotate(270deg); } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <svg style={{ width: 56, height: 56, margin: '0 auto 24px', animation: 'spin-ring 1s linear infinite' }} viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="22" stroke={`${T.primary}20`} strokeWidth="4" />
            <path d="M28 6 a22 22 0 0 1 22 22" stroke={T.primary} strokeWidth="4" strokeLinecap="round" />
          </svg>
          <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '1.375rem', color: T.textPrimary, margin: '0 0 8px' }}>Analyzing your session</h2>
          <p style={{ fontSize: '0.875rem', color: T.textSecond, margin: '0 0 4px' }}>Reviewing code, communication, and problem-solving...</p>
          <p style={{ fontSize: '0.75rem', color: T.textMuted, margin: '0 0 24px' }}>This usually takes about 20 seconds.</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            {['Reviewing conversation', 'Evaluating code quality', 'Generating feedback'].map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.6875rem', color: T.textMuted }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: T.primary, opacity: 0.6 }} />
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const avg = Math.round((feedback.communicationScore + feedback.problemSolvingScore + feedback.codeQualityScore) / 3);
  const avgColor = avg >= 8 ? T.tertiary : avg >= 5 ? T.primary : T.errorDim;
  const fluencyLabel = avg >= 8 ? 'Outstanding' : avg >= 7 ? 'Strength' : avg >= 5 ? 'Developing' : 'Needs Work';

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: T.surface, overflowY: 'auto', fontFamily: 'var(--font-inter), sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
          <div>
            <span style={{ display: 'block', fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.6875rem', color: T.secondary, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Performance Review</span>
            <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '2.75rem', color: T.textPrimary, letterSpacing: '-0.02em', margin: 0, lineHeight: 1.1 }}>Session Report</h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ padding: '6px 16px', background: `${avgColor}1a`, border: `1px solid ${avgColor}33`, borderRadius: 4, fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '1rem', color: avgColor }}>
              {fluencyLabel}
            </div>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5625rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Performance level</span>
          </div>
        </div>

        {/* Score cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
          <ScoreRing label="Communication" score={feedback.communicationScore} explanation={feedback.communicationExplanation} delay={0} />
          <ScoreRing label="Problem Solving" score={feedback.problemSolvingScore} explanation={feedback.problemSolvingExplanation} delay={150} />
          <ScoreRing label="Code Quality" score={feedback.codeQualityScore} explanation={feedback.codeQualityExplanation} delay={300} />
        </div>

        {/* Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
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
          <div style={{ background: T.surfaceLow, padding: '24px', borderRadius: 8, border: `1px solid ${T.outline}` }}>
            <h3 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '0.875rem', color: T.textPrimary, margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" fill="none" stroke={T.primary} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>
              Time Management
            </h3>
            <p style={{ fontSize: '0.8125rem', color: T.textSecond, lineHeight: 1.7, margin: 0 }}>{feedback.timeManagement}</p>
          </div>
        </div>

        {/* Aggregate + closing note */}
        <div style={{ background: `${T.secondary}12`, padding: '40px', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 36, border: `1px solid ${T.secondary}20` }}>
          <div style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '3.5rem', color: T.textPrimary, lineHeight: 1, marginBottom: 6 }}>{avg}</div>
          <div style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5625rem', color: T.secondary, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 24 }}>Aggregate Performance Score</div>
          <blockquote style={{ maxWidth: 560, fontStyle: 'italic', color: '#ceb9ff', background: `${T.secondary}12`, padding: '18px 24px', borderRadius: 6, border: `1px solid ${T.secondary}25`, fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>
            "{feedback.closingNote}"
          </blockquote>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onRestart}
            style={{ padding: '13px 48px', background: `linear-gradient(135deg, ${T.primary} 0%, ${T.primaryCont} 100%)`, color: '#002c66', borderRadius: 6, border: 'none', fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: `0 8px 24px ${T.primary}30`, transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${T.primary}45`; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 24px ${T.primary}30`; }}
          >
            Practice Another Problem
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InterviewSession({ problem }: { problem: Problem }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState(STUBS.python);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [chatWidth, setChatWidth] = useState(340);
  const [problemHeight, setProblemHeight] = useState(220);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(340);
  const isVDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(220);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timeElapsedRef = useRef(0);
  const animatedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!sessionStarted || sessionEnded) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(interval); handleEndSession(); return 0; }
        timeElapsedRef.current += 1;
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStarted, sessionEnded]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const sendMessage = useCallback(async (userMessage: string, msgs: Message[]) => {
    setIsStreaming(true);
    const updated = [...msgs, { role: 'user' as const, content: userMessage }];
    setMessages(updated);
    const aIdx = updated.length;
    setMessages((p) => [...p, { role: 'assistant', content: '' }]);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated, problemTitle: problem.title, problemDescription: problem.description, code, language }),
      });
      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      let acc = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMessages((p) => { const n = [...p]; n[aIdx] = { role: 'assistant', content: acc }; return n; });
      }
      setMessages((p) => { const n = [...p]; n[aIdx] = { role: 'assistant', content: acc }; return n; });
    } finally {
      setIsStreaming(false);
    }
  }, [problem]);

  useEffect(() => {
    if (sessionStarted) return;
    setSessionStarted(true);
    sendMessage(`Hi! I'm ready to start the interview. The problem is "${problem.title}".`, []);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;
    const msg = input.trim();
    setInput('');
    await sendMessage(msg, messages);
  };

  const handleEndSession = useCallback(async () => {
    if (sessionEnded) return;
    setSessionEnded(true);
    setLoadingFeedback(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, code, problemTitle: problem.title, timeElapsed: timeElapsedRef.current }),
      });
      const data: FeedbackData = await res.json();
      setFeedback(data);
      const record: SessionRecord = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        problemTitle: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        duration: formatDuration(timeElapsedRef.current),
        scores: { communication: data.communicationScore, problemSolving: data.problemSolvingScore, codeQuality: data.codeQualityScore },
        overallScore: Math.round((data.communicationScore + data.problemSolvingScore + data.codeQualityScore) / 3),
        topImprovements: data.topImprovements,
        fullFeedback: data.closingNote,
      };
      saveSession(record);
    } finally {
      setLoadingFeedback(false);
    }
  }, [sessionEnded, messages, code, problem]);

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

  const handleLanguageChange = (lang: Language) => { setLanguage(lang); setCode(STUBS[lang]); };

  const timerColor = timeLeft > 600 ? T.tertiary : timeLeft > 180 ? '#facc15' : T.error;

  if (sessionEnded) {
    return <FeedbackScreen feedback={feedback} loading={loadingFeedback} onRestart={() => router.push('/problems')} />;
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
        .hdiv:hover { background: ${T.primary} !important; }
        .vdiv:hover { background: ${T.primary} !important; }
        .end-btn:hover { background: rgba(255,113,108,0.22) !important; }
        .chat-send:not(:disabled):hover { opacity: 0.85 !important; }
        @keyframes spin-ring { from{transform:rotate(-90deg)}to{transform:rotate(270deg)} }
      `}</style>

      {/* Sub-header */}
      <div style={{ height: 52, background: 'rgba(19,19,20,0.92)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${T.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '0.875rem', color: T.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 320 }}>{problem.title}</span>
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 10px', background: T.surfaceHigh, borderRadius: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke={T.secondary}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.75rem', color: timerColor, fontWeight: 500 }}>{formatTime(timeLeft)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', background: T.surfaceLow, borderRadius: 4, border: `1px solid ${T.outline}` }}>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.12em' }}>Language</span>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.75rem', color: T.primary, background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer' }}
            >
              {(Object.keys(LANGUAGE_LABELS) as Language[]).map((l) => (
                <option key={l} value={l} style={{ background: T.surfaceMid, color: T.textPrimary }}>{LANGUAGE_LABELS[l]}</option>
              ))}
            </select>
          </div>
          <button className="end-btn" onClick={handleEndSession} style={{ padding: '6px 14px', fontSize: '0.75rem', fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 600, color: T.error, background: `${T.error}18`, borderRadius: 4, border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}>
            End Session
          </button>
        </div>
      </div>

      {/* Split pane */}
      <div className="s-dot-grid" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Chat */}
        <div style={{ width: chatWidth, flexShrink: 0, display: 'flex', flexDirection: 'column', background: T.surfaceLow, borderRight: `1px solid ${T.outline}` }}>
          <div style={{ padding: '13px 18px', borderBottom: `1px solid ${T.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.tertiary, boxShadow: `0 0 8px ${T.tertiary}` }} />
              <span style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em', color: T.textPrimary }}>AI_INTERVIEWER</span>
            </div>
            <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>v4.2-stable</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                    <div className="chat-glass" style={{ borderRadius: '10px 10px 10px 2px', padding: '10px 14px', maxWidth: '90%', borderTop: `2px solid ${T.secondary}`, borderRight: `1px solid ${T.outline}`, borderBottom: `1px solid ${T.outline}`, borderLeft: `1px solid ${T.outline}` }}>
                      <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: T.textPrimary, margin: 0, whiteSpace: 'pre-wrap' }}>
                        {msg.content || (isStreaming && i === messages.length - 1 ? '▌' : '')}
                      </p>
                    </div>
                  )}
                  <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5rem', color: msg.role === 'user' ? T.textMuted : T.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {msg.role === 'user' ? 'You' : 'INTERVIEWER_AI'}
                  </span>
                </div>
              );
            })}
            {isStreaming && messages[messages.length - 1]?.content === '' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.6 }}>
                <div style={{ display: 'flex', gap: 3 }}><div className="typing-dot"/><div className="typing-dot"/><div className="typing-dot"/></div>
                <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5rem', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>ANALYZING...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: '12px 14px', background: T.surfaceMid }}>
            <div style={{ position: 'relative' }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Discuss approach or ask a question..."
                disabled={isStreaming}
                rows={3}
                style={{ width: '100%', background: T.surface, border: `1px solid ${T.outline}`, borderRadius: 8, padding: '10px 44px 10px 12px', fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.8rem', color: T.textPrimary, outline: 'none', resize: 'none', boxSizing: 'border-box', opacity: isStreaming ? 0.5 : 1, lineHeight: 1.5 }}
              />
              <button
                className="chat-send"
                onClick={handleSend}
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

        {/* Horizontal drag */}
        <div className="hdiv" onMouseDown={handleDividerMouseDown} style={{ width: 3, background: T.outline, cursor: 'col-resize', flexShrink: 0, transition: 'background 0.15s' }} />

        {/* Right: problem + editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Problem */}
          <div style={{ height: problemHeight, overflowY: 'auto', padding: '16px 20px', flexShrink: 0, background: T.surfaceLow }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: T.textPrimary, margin: 0 }}>{problem.title}</h2>
              <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: '0.5625rem', fontFamily: 'var(--font-jetbrains-mono), monospace', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', background: diffBg, color: diffColor, border: `1px solid ${diffBorder}` }}>{problem.difficulty}</span>
              <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: '0.5625rem', fontFamily: 'var(--font-jetbrains-mono), monospace', color: T.textMuted, background: T.surfaceHigh }}>{problem.category}</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: T.textSecond, lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: '0 0 12px' }}>{problem.description}</p>
            {problem.examples.map((ex, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <span style={{ fontSize: '0.5625rem', color: T.textMuted, fontFamily: 'var(--font-jetbrains-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Example {i + 1}</span>
                <div style={{ marginTop: 3, padding: '7px 12px', background: T.surface, borderRadius: 4, fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.6875rem', color: T.textSecond, lineHeight: 1.6 }}>
                  <div>Input: {ex.input}</div>
                  <div>Output: {ex.output}</div>
                  {ex.explanation && <div style={{ color: T.textMuted, fontStyle: 'italic', marginTop: 2 }}>{ex.explanation}</div>}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 8 }}>
              <p style={{ fontSize: '0.5rem', color: T.textMuted, fontFamily: 'var(--font-jetbrains-mono), monospace', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>Constraints</p>
              {problem.constraints.map((c, i) => (
                <div key={i} style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.6875rem', color: T.textSecond, marginBottom: 2 }}>• {c}</div>
              ))}
            </div>
          </div>

          {/* Vertical drag */}
          <div className="vdiv" onMouseDown={handleVerticalDividerMouseDown} style={{ height: 3, background: T.outline, cursor: 'row-resize', flexShrink: 0, transition: 'background 0.15s' }} />

          {/* IDE toolbar */}
          <div style={{ height: 40, background: T.surfaceLow, borderBottom: `1px solid ${T.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 8px', borderBottom: `2px solid ${T.primary}` }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.primary} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.6875rem', color: T.textPrimary }}>solution.{FILE_EXT[language]}</span>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <button onClick={() => setCode(STUBS[language])} style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5rem', color: T.textMuted, background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reset</button>
              <button onClick={() => navigator.clipboard.writeText(code)} style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5rem', color: T.textMuted, background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Copy</button>
            </div>
          </div>

          {/* Monaco */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <MonacoEditor
              height="100%"
              language={MONACO_LANGUAGE_MAP[language]}
              value={code}
              onChange={(v) => setCode(v || '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                tabSize: language === 'python' ? 4 : 2,
                lineNumbers: 'on',
                folding: true,
                automaticLayout: true,
                quickSuggestions: true,
                suggestOnTriggerCharacters: true,
                fontFamily: "'JetBrains Mono', 'Cascadia Code', monospace",
                lineHeight: 22,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
