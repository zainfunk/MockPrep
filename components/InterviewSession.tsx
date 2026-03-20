'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Problem } from '@/lib/problems';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

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

export default function InterviewSession({ problem }: { problem: Problem }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [code, setCode] = useState(problem.starterCode);
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timeElapsedRef = useRef(0);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Timer
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

  // Start session with AI greeting
  useEffect(() => {
    if (sessionStarted) return;
    setSessionStarted(true);
    sendMessage(
      `Hi! I'm ready to start the interview. The problem is "${problem.title}".`,
      []
    );
  }, []);

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
      const data = await response.json();
      setFeedback(data);
    } finally {
      setLoadingFeedback(false);
    }
  }, [sessionEnded, messages, code, problem.title]);

  const timerColor =
    timeLeft > 600 ? 'text-green-400' : timeLeft > 180 ? 'text-yellow-400' : 'text-red-400';

  if (sessionEnded) {
    return (
      <FeedbackScreen
        feedback={feedback}
        loading={loadingFeedback}
        onRestart={() => router.push('/')}
      />
    );
  }

  return (
    <div className="h-screen bg-gray-950 text-gray-100 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4 shrink-0">
        <span className="font-semibold text-white truncate max-w-xs">{problem.title}</span>
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
        <div className="w-80 flex flex-col border-r border-gray-700 bg-gray-900">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-700">
            AI Interviewer
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[90%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-750 border border-gray-600 text-gray-100'
                  }`}
                  style={msg.role === 'assistant' ? { backgroundColor: '#2d3748' } : {}}
                >
                  {msg.content || (isStreaming && i === messages.length - 1 ? '▌' : '')}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="p-3 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Type a message..."
                disabled={isStreaming}
                className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
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

        {/* Right: Problem + Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Problem Description */}
          <div className="h-52 overflow-y-auto border-b border-gray-700 bg-gray-900 p-4">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="font-semibold text-white">{problem.title}</h2>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                  problem.difficulty === 'easy'
                    ? 'bg-green-900 text-green-300'
                    : problem.difficulty === 'medium'
                    ? 'bg-yellow-900 text-yellow-300'
                    : 'bg-red-900 text-red-300'
                }`}
              >
                {problem.difficulty}
              </span>
            </div>
            <p className="text-gray-300 text-sm whitespace-pre-wrap mb-3">{problem.description}</p>
            {problem.examples.map((ex, i) => (
              <div key={i} className="mb-2 text-sm">
                <span className="text-gray-500 font-medium">Example {i + 1}:</span>
                <div className="bg-gray-800 rounded px-2 py-1 mt-1 font-mono text-xs text-gray-300">
                  <div>Input: {ex.input}</div>
                  <div>Output: {ex.output}</div>
                  {ex.explanation && <div className="text-gray-500">// {ex.explanation}</div>}
                </div>
              </div>
            ))}
            <div className="mt-2">
              <p className="text-gray-500 text-xs font-medium mb-1">Constraints:</p>
              <ul className="text-xs text-gray-400 space-y-0.5">
                {problem.constraints.map((c, i) => (
                  <li key={i} className="font-mono">• {c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              height="100%"
              defaultLanguage="typescript"
              value={code}
              onChange={(v) => setCode(v || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                tabSize: 2,
                lineNumbers: 'on',
                folding: true,
                automaticLayout: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  score,
  explanation,
}: {
  label: string;
  score: number;
  explanation: string;
}) {
  const color =
    score >= 8 ? 'text-green-400' : score >= 5 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-200">{label}</span>
        <span className={`text-2xl font-bold ${color}`}>{score}/10</span>
      </div>
      <p className="text-sm text-gray-400">{explanation}</p>
    </div>
  );
}

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
      <div className="h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">Analyzing...</div>
          <p className="text-gray-400 text-lg">Analyzing your session...</p>
          <p className="text-gray-600 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  const avg = Math.round(
    (feedback.communicationScore + feedback.problemSolvingScore + feedback.codeQualityScore) / 3
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Session Complete</h1>
          <p className="text-gray-400">Here is how you did</p>
          <div className="mt-4 text-6xl font-bold text-blue-400">{avg}/10</div>
          <p className="text-gray-500 text-sm">Overall Average</p>
        </div>

        <div className="space-y-4 mb-6">
          <ScoreCard
            label="Communication"
            score={feedback.communicationScore}
            explanation={feedback.communicationExplanation}
          />
          <ScoreCard
            label="Problem Solving"
            score={feedback.problemSolvingScore}
            explanation={feedback.problemSolvingExplanation}
          />
          <ScoreCard
            label="Code Quality"
            score={feedback.codeQualityScore}
            explanation={feedback.codeQualityExplanation}
          />
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-4">
          <h3 className="font-medium text-gray-200 mb-2">Time Management</h3>
          <p className="text-sm text-gray-400">{feedback.timeManagement}</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-4">
          <h3 className="font-medium text-gray-200 mb-3">Top 3 Things to Improve</h3>
          <ol className="space-y-2">
            {feedback.topImprovements.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-400">
                <span className="text-blue-400 font-bold shrink-0">{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4 mb-6">
          <p className="text-blue-300 text-sm">{feedback.closingNote}</p>
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
        >
          Practice Another Problem
        </button>
      </div>
    </div>
  );
}
