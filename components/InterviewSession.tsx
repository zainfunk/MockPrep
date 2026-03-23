'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Problem } from '@/lib/problems';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

type Language = 'python' | 'javascript' | 'java' | 'cpp';

const LANGUAGE_LABELS: Record<Language, string> = {
  python: 'Python',
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

const STUBS: Record<Language, string> = {
  python: `def solution():\n    pass`,
  javascript: `function solution() {\n  // your solution here\n}`,
  java: `class Solution {\n    public void solution() {\n        // your solution here\n    }\n}`,
  cpp: `class Solution {\npublic:\n    void solution() {\n        // your solution here\n    }\n};`,
};

const TOTAL_SECONDS = 45 * 60;

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
  scores: {
    communication: number;
    problemSolving: number;
    codeQuality: number;
  };
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
  } catch {
    // localStorage may be unavailable in some environments — silently ignore
  }

  // Save to DB (fire and forget — don't block UI)
  fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'interview', session: record }),
  }).catch(() => {});
}

export default function InterviewSession({ problem }: { problem: Problem }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState<Language>('python');
  const [code, setCode] = useState(STUBS.python);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [chatWidth, setChatWidth] = useState(320);
  const [problemHeight, setProblemHeight] = useState(208);
  const [isDark, setIsDark] = useState(true);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(320);
  const isVDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(208);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timeElapsedRef = useRef(0);
  // Track which message indices have already been animated
  const animatedRef = useRef<Set<number>>(new Set());

  // Sync dark mode state with document class
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setIsDark(saved ? saved === 'dark' : document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Timer
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!sessionStarted || sessionEnded) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          handleEndSession();
          return 0;
        }
        timeElapsedRef.current += 1;
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStarted, sessionEnded]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const sendMessage = useCallback(
    async (userMessage: string, msgs: Message[]) => {
      setIsStreaming(true);
      const updatedMessages = [...msgs, { role: 'user' as const, content: userMessage }];
      setMessages(updatedMessages);

      const assistantMessageIndex = updatedMessages.length;
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: updatedMessages,
            problemTitle: problem.title,
            problemDescription: problem.description,
            code,
            language,
          }),
        });

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const next = [...prev];
            next[assistantMessageIndex] = { role: 'assistant', content: accumulated };
            return next;
          });
        }

        setMessages((prev) => {
          const next = [...prev];
          next[assistantMessageIndex] = { role: 'assistant', content: accumulated };
          return next;
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [problem]
  );

  // Start session with AI greeting — intentionally runs once on mount
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (sessionStarted) return;
    setSessionStarted(true);
    sendMessage(
      `Hi! I'm ready to start the interview. The problem is "${problem.title}".`,
      []
    );
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

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
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          code,
          problemTitle: problem.title,
          timeElapsed: timeElapsedRef.current,
        }),
      });
      const data: FeedbackData = await response.json();
      setFeedback(data);

      // Save session to localStorage
      const record: SessionRecord = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        problemTitle: problem.title,
        difficulty: problem.difficulty,
        category: problem.category,
        duration: formatDuration(timeElapsedRef.current),
        scores: {
          communication: data.communicationScore,
          problemSolving: data.problemSolvingScore,
          codeQuality: data.codeQualityScore,
        },
        overallScore: Math.round(
          (data.communicationScore + data.problemSolvingScore + data.codeQualityScore) / 3
        ),
        topImprovements: data.topImprovements,
        fullFeedback: data.closingNote,
      };
      saveSession(record);
    } finally {
      setLoadingFeedback(false);
    }
  }, [sessionEnded, messages, code, problem]);

  const handleDividerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      dragStartX.current = e.clientX;
      dragStartWidth.current = chatWidth;
      e.preventDefault();

      const onMouseMove = (ev: MouseEvent) => {
        if (!isDragging.current) return;
        const delta = ev.clientX - dragStartX.current;
        const next = Math.min(600, Math.max(200, dragStartWidth.current + delta));
        setChatWidth(next);
      };
      const onMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [chatWidth]
  );

  const handleVerticalDividerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isVDragging.current = true;
      dragStartY.current = e.clientY;
      dragStartHeight.current = problemHeight;
      e.preventDefault();

      const onMouseMove = (ev: MouseEvent) => {
        if (!isVDragging.current) return;
        const delta = ev.clientY - dragStartY.current;
        const next = Math.min(500, Math.max(80, dragStartHeight.current + delta));
        setProblemHeight(next);
      };
      const onMouseUp = () => {
        isVDragging.current = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [problemHeight]
  );

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCode(STUBS[lang]);
  };

  const handleResetCode = () => setCode(STUBS[language]);
  const handleCopyCode = () => navigator.clipboard.writeText(code);

  const timerColor =
    timeLeft > 600 ? 'text-green-400' : timeLeft > 180 ? 'text-yellow-400' : 'text-red-400';

  if (sessionEnded) {
    return (
      <FeedbackScreen
        feedback={feedback}
        loading={loadingFeedback}
        onRestart={() => router.push('/problems')}
      />
    );
  }

  return (
    <div className={`h-[calc(100vh-56px)] flex flex-col overflow-hidden ${isDark ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Top Bar */}
      <div className={`h-14 border-b flex items-center justify-between px-4 shrink-0 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <span className={`font-semibold truncate max-w-xs ${isDark ? 'text-white' : 'text-gray-900'}`}>{problem.title}</span>
        <div className="flex items-center gap-4">
          <span className={`font-mono text-lg font-bold ${timerColor}`}>
            {formatTime(timeLeft)}
          </span>
          <button
            onClick={handleEndSession}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Chat Panel */}
        <div
          className={`flex flex-col border-r shrink-0 ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}
          style={{ width: chatWidth }}
        >
          <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider border-b ${isDark ? 'text-gray-500 border-gray-700' : 'text-gray-400 border-gray-200'}`}>
            AI Interviewer
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {messages.map((msg, i) => {
              const isNew = !animatedRef.current.has(i);
              if (isNew && msg.content) {
                animatedRef.current.add(i);
              }
              return (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} ${isNew && msg.content ? 'fade-in' : ''}`}
                >
                  <span className="text-xs text-gray-500 mb-1 px-1">
                    {msg.role === 'user' ? 'You' : 'Interviewer'}
                  </span>
                  <div
                    className="max-w-[90%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap"
                    style={isDark
                      ? { backgroundColor: msg.role === 'user' ? '#2a2a2a' : '#1e293b', color: '#ffffff' }
                      : { backgroundColor: msg.role === 'user' ? '#e5e7eb' : '#eff6ff', color: '#111827' }
                    }
                  >
                    {msg.content || (isStreaming && i === messages.length - 1 ? '▌' : '')}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
          <div className={`p-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Type a message..."
                disabled={isStreaming}
                className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50 ${isDark ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400'}`}
              />
              <button
                onClick={handleSend}
                disabled={isStreaming || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Drag Divider */}
        <div
          onMouseDown={handleDividerMouseDown}
          className={`w-1.5 hover:bg-blue-500 cursor-col-resize shrink-0 transition-colors ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
        />

        {/* Right: Problem + Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Problem Description */}
          <div
            className={`overflow-y-auto p-4 shrink-0 ${isDark ? 'bg-gray-900' : 'bg-white'}`}
            style={{ height: problemHeight }}
          >
            <div className="flex items-center gap-3 mb-3">
              <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{problem.title}</h2>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                  problem.difficulty === 'easy'
                    ? isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700 border border-green-300'
                    : problem.difficulty === 'medium'
                    ? isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                    : isDark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700 border border-red-300'
                }`}
              >
                {problem.difficulty}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs ${isDark ? 'text-gray-500 bg-gray-800' : 'text-gray-500 bg-gray-100 border border-gray-200'}`}>
                {problem.category}
              </span>
            </div>
            <p className={`text-sm whitespace-pre-wrap mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {problem.description}
            </p>
            {problem.examples.map((ex, i) => (
              <div key={i} className="mb-2 text-sm">
                <span className={`font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Example {i + 1}:</span>
                <div className={`rounded px-2 py-1 mt-1 font-mono text-xs ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                  <div>Input: {ex.input}</div>
                  <div>Output: {ex.output}</div>
                  {ex.explanation && (
                    <div className={isDark ? 'text-gray-500 italic' : 'text-gray-500 italic'}>{ex.explanation}</div>
                  )}
                </div>
              </div>
            ))}
            <div className="mt-2">
              <p className="text-gray-500 text-xs font-medium mb-1">Constraints:</p>
              <ul className={`text-xs space-y-0.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {problem.constraints.map((c, i) => (
                  <li key={i} className="font-mono">
                    • {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Vertical Drag Divider */}
          <div
            onMouseDown={handleVerticalDividerMouseDown}
            className={`h-1.5 hover:bg-blue-500 cursor-row-resize shrink-0 transition-colors ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
          />

          {/* Editor Toolbar */}
          <div
            className={`flex items-center gap-2 px-3 py-2 border-b shrink-0 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
            style={{ backgroundColor: isDark ? '#1a202c' : '#f9fafb' }}
          >
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className={`border text-sm rounded px-2 py-1 focus:outline-none focus:border-blue-500 ${isDark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGE_LABELS[lang]}
                </option>
              ))}
            </select>
            <button
              onClick={handleResetCode}
              className={`text-sm px-3 py-1 rounded transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'}`}
            >
              Reset Code
            </button>
            <button
              onClick={handleCopyCode}
              className={`text-sm px-3 py-1 rounded transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300'}`}
            >
              Copy Code
            </button>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              height="100%"
              language={MONACO_LANGUAGE_MAP[language]}
              value={code}
              onChange={(v) => setCode(v || '')}
              theme={isDark ? 'vs-dark' : 'vs-light'}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                tabSize: language === 'python' ? 4 : 2,
                lineNumbers: 'on',
                folding: true,
                automaticLayout: true,
                quickSuggestions: true,
                suggestOnTriggerCharacters: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ScoreCard ───────────────────────────────────────────────────────────────

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
  const pct = Math.min(100, Math.max(0, score / 10));
  const dash = pct * circ;
  const color = score >= 8 ? '#4ade80' : score >= 5 ? '#facc15' : '#f87171';
  const textColor = score >= 8 ? 'text-green-400' : score >= 5 ? 'text-yellow-400' : 'text-red-400';
  const trackColor = score >= 8 ? 'rgba(74,222,128,0.1)' : score >= 5 ? 'rgba(250,204,21,0.1)' : 'rgba(248,113,113,0.1)';

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center">
      {/* Ring */}
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
          <span className={`text-2xl font-extrabold ${textColor}`}>{score}</span>
        </div>
      </div>
      <h3 className="text-gray-900 dark:text-white font-semibold mb-2">{label}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{explanation}</p>
    </div>
  );
}

// ─── FeedbackScreen ──────────────────────────────────────────────────────────

function FeedbackScreen({
  feedback,
  loading,
  onRestart,
}: {
  feedback: FeedbackData | null;
  loading: boolean;
  onRestart: () => void;
}) {
  if (loading || !feedback) {
    return (
      <div className="h-[calc(100vh-56px)] bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          {/* Spinner */}
          <div className="w-20 h-20 mx-auto mb-8">
            <svg className="w-20 h-20 animate-spin" viewBox="0 0 80 80" fill="none" aria-hidden>
              <circle cx="40" cy="40" r="34" stroke="rgba(59,130,246,0.15)" strokeWidth="6" />
              <path
                d="M40 6 a34 34 0 0 1 34 34"
                stroke="#3b82f6"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analyzing your session</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Reviewing your code, communication, and problem-solving approach...</p>
          <p className="text-gray-400 dark:text-gray-600 text-xs mb-6">This usually takes about 20 seconds.</p>

          {/* Animated steps */}
          <div className="flex flex-col items-center gap-2 text-sm">
            {[
              'Reviewing conversation',
              'Evaluating code quality',
              'Generating feedback',
            ].map((step, i) => (
              <div
                key={step}
                className="flex items-center gap-2 text-gray-500"
                style={{ animation: `pulse 1.5s ease-in-out ${i * 0.4}s infinite` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60" />
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const avg = Math.round(
    (feedback.communicationScore + feedback.problemSolvingScore + feedback.codeQualityScore) / 3
  );

  const avgColor = avg >= 8 ? 'text-green-400' : avg >= 5 ? 'text-yellow-400' : 'text-red-400';
  const avgR = 54;
  const avgCirc = 2 * Math.PI * avgR;
  const avgDash = (avg / 10) * avgCirc;
  const avgStroke = avg >= 8 ? '#4ade80' : avg >= 5 ? '#facc15' : '#f87171';
  const avgTrack = avg >= 8 ? 'rgba(74,222,128,0.1)' : avg >= 5 ? 'rgba(250,204,21,0.1)' : 'rgba(248,113,113,0.1)';

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-y-auto">

      {/* ── Hero header ── */}
      <div className="relative border-b border-gray-800/60 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 100% at 50% -10%, rgba(59,130,246,0.1) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-10">

            {/* Overall score ring */}
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
                  <span className={`text-4xl font-extrabold leading-none ${avgColor}`}>{avg}</span>
                  <span className="text-gray-500 text-xs mt-0.5">/10</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-3">Overall Score</p>
            </div>

            {/* Title + summary */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Session Complete
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
                {avg >= 8 ? 'Outstanding work.' : avg >= 5 ? 'Solid effort.' : 'Keep pushing.'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-lg">
                {feedback.closingNote}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Score breakdown ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Score Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <ScoreRing label="Communication" score={feedback.communicationScore} explanation={feedback.communicationExplanation} delay={100} />
          <ScoreRing label="Problem Solving" score={feedback.problemSolvingScore} explanation={feedback.problemSolvingExplanation} delay={250} />
          <ScoreRing label="Code Quality" score={feedback.codeQualityScore} explanation={feedback.codeQualityExplanation} delay={400} />
        </div>

        {/* ── Details grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">

          {/* Improvements */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top 3 Things to Improve</h3>
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

          {/* Time management */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Time Management</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feedback.timeManagement}</p>
          </div>
        </div>

        {/* ── CTA ── */}
        <button
          onClick={onRestart}
          className="btn-glow w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-semibold text-base transition-colors"
        >
          Practice Another Problem
        </button>
      </div>
    </div>
  );
}
