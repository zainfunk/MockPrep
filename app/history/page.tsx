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

interface FluencyQuestionResult {
  scores: {
    specificity: number;
    genaiLiteracy: number;
    criticalThinking: number;
    judgment: number;
    responsibility: number;
    learningAgility: number;
    communication: number;
  };
  totalScore: number;
  notes: string;
}

interface FluencySessionRecord {
  id: string;
  date: string;
  duration: number;
  questions: Array<{ question: string; category: string; response: string }>;
  questionResults: FluencyQuestionResult[];
  aggregateScores: {
    specificity: number;
    genaiLiteracy: number;
    criticalThinking: number;
    judgment: number;
    responsibility: number;
    learningAgility: number;
    communication: number;
  };
  totalScore: number;
  rating: string;
  hasRedFlags: boolean;
  redFlagDetails: string[];
  keyStrengths: string[];
  keyImprovements: string[];
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

// ── Icons ────────────────────────────────────────────────────────────────────

function IconDatabase() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v4c0 1.657 4.03 3 9 3s9-1.343 9-3V5" />
      <path d="M3 9v4c0 1.657 4.03 3 9 3s9-1.343 9-3V9" />
      <path d="M3 13v4c0 1.657 4.03 3 9 3s9-1.343 9-3v-4" />
    </svg>
  );
}

function IconTerminal() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <path d="M8 9l4 4-4 4M13 17h3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBrain() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg className={`w-5 h-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function IconTimer() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconCategory() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}

function IconTrending() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function difficultyBadge(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-[#69f6b8]/10 text-[#58e7ab] border border-[#69f6b8]/20';
    case 'medium':
      return 'bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20';
    case 'hard':
      return 'bg-[#9f0519]/10 text-[#d7383b] border border-[#9f0519]/20';
    default:
      return 'bg-white/5 text-white/50 border border-white/10';
  }
}

function fluencyBadge(level: string) {
  switch (level) {
    case 'Strength':       return 'bg-[#69f6b8]/10 text-[#58e7ab] border border-[#69f6b8]/30';
    case 'Mild Strength':  return 'bg-[#6ee7b7]/10 text-[#6ee7b7] border border-[#6ee7b7]/30';
    case 'Mixed':          return 'bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/30';
    case 'Mild Concern':   return 'bg-[#fb923c]/10 text-[#fb923c] border border-[#fb923c]/30';
    case 'Concern':        return 'bg-[#9f0519]/10 text-[#d7383b] border border-[#9f0519]/30';
    default:               return 'bg-[#ceb9ff]/10 text-[#ceb9ff] border border-[#ceb9ff]/30';
  }
}

// ── Session Card ─────────────────────────────────────────────────────────────

function SessionCard({ session }: { session: SessionRecord }) {
  const [expanded, setExpanded] = useState(false);

  const efficiency  = Math.round(session.scores.problemSolving * 10);
  const logic       = Math.round(session.scores.communication * 10);
  const cleanCode   = Math.round(session.scores.codeQuality * 10);
  const overall     = Math.round(session.overallScore * 10);

  return (
    <div className="bg-[#131314] rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-6 flex flex-wrap items-center justify-between gap-6 hover:bg-[#1a191b] transition-colors focus:outline-none"
      >
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="font-headline font-bold text-lg text-white">{session.problemTitle}</h4>
            <span className={`font-headline text-[10px] font-bold px-2 py-0.5 rounded uppercase ${difficultyBadge(session.difficulty)}`}>
              {session.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-headline text-[#adaaab]">
            <span className="flex items-center gap-1"><IconCategory />{session.category}</span>
            <span className="flex items-center gap-1"><IconCalendar />{session.date}</span>
            <span className="flex items-center gap-1"><IconTimer />{session.duration}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-[#1a191b] rounded-md border border-[#484849]/30 flex flex-col items-center min-w-[58px]">
            <span className="text-[10px] font-headline text-[#adaaab] uppercase tracking-wide">Efficiency</span>
            <span className="font-headline font-bold text-[#ac8aff]">{efficiency}%</span>
          </div>
          <div className="px-3 py-1 bg-[#1a191b] rounded-md border border-[#484849]/30 flex flex-col items-center min-w-[58px]">
            <span className="text-[10px] font-headline text-[#adaaab] uppercase tracking-wide">Logic</span>
            <span className="font-headline font-bold text-[#9bffce]">{logic}%</span>
          </div>
          <div className="px-3 py-1 bg-[#1a191b] rounded-md border border-[#484849]/30 flex flex-col items-center min-w-[58px]">
            <span className="text-[10px] font-headline text-[#adaaab] uppercase tracking-wide">Clean Code</span>
            <span className="font-headline font-bold text-[#85adff]">{cleanCode}%</span>
          </div>
          <div className="ml-4 text-center min-w-[48px]">
            <div className="text-3xl font-headline font-bold text-white leading-none">{overall}</div>
            <div className="text-[10px] font-headline text-[#adaaab] uppercase mt-0.5">Overall</div>
          </div>
          <div className="text-[#767576]"><IconChevron open={expanded} /></div>
        </div>
      </button>

      {expanded && (
        <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#1a191b]/40 border-t border-white/5">
          {session.topImprovements?.length > 0 && (
            <div>
              <h5 className="font-headline text-xs font-bold text-[#adaaab] uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="text-[#ac8aff]"><IconTrending /></span> Top Improvements
              </h5>
              <ul className="space-y-2">
                {session.topImprovements.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-white/80">
                    <span className="font-headline text-[#ac8aff] font-bold shrink-0">
                      {String(i + 1).padStart(2, '0')}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {session.fullFeedback && (
            <div className="bg-[#85adff]/5 p-4 rounded-lg border border-[#85adff]/10">
              <h5 className="font-headline text-xs font-bold text-[#85adff] uppercase tracking-widest mb-2">
                Architect&apos;s Feedback
              </h5>
              <p className="text-sm leading-relaxed text-white/90">{session.fullFeedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── GenAI Session Card ────────────────────────────────────────────────────────

function GenAISessionCard({ session }: { session: GenAISessionRecord }) {
  const [expanded, setExpanded] = useState(false);

  const skillTags = [
    { abbr: 'P.Q.', label: 'Prompt Quality',    score: session.scores.promptQuality },
    { abbr: 'O.V.', label: 'Output Validation', score: session.scores.outputValidation },
    { abbr: 'H.J.', label: 'Human Judgment',    score: session.scores.humanJudgment },
    { abbr: 'A.C.', label: 'Accountability',    score: session.scores.accountability },
  ];

  const durationMin = Math.round(session.duration / 60);

  return (
    <div className="bg-[#131314] rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-6 flex flex-wrap items-center justify-between gap-6 hover:bg-[#1a191b] transition-colors focus:outline-none"
      >
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="font-headline font-bold text-lg text-white">{session.problemTitle}</h4>
            <span className={`font-headline text-[10px] font-bold px-2 py-0.5 rounded uppercase ${difficultyBadge(session.difficulty)}`}>
              {session.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-headline text-[#adaaab]">
            <span className="flex items-center gap-1"><IconCategory />{session.category}</span>
            <span className="flex items-center gap-1"><IconCalendar />{new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="flex items-center gap-1"><IconTimer />{durationMin}m</span>
            <span>{session.promptCount} prompt{session.promptCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {skillTags.map((tag) => (
              <div
                key={tag.abbr}
                title={tag.label}
                className="w-9 h-9 rounded bg-[#5516be]/10 border border-[#ac8aff]/20 flex items-center justify-center"
              >
                <span className="text-[9px] font-headline font-bold text-[#ac8aff]">{tag.abbr}</span>
              </div>
            ))}
          </div>
          <div className="ml-4 text-right">
            <div className={`text-lg font-headline font-bold ${fluencyBadge(session.fluencyLevel).includes('9bffce') || fluencyBadge(session.fluencyLevel).includes('6ee7') ? 'text-[#58e7ab]' : 'text-white'}`}>
              {session.fluencyLevel}
            </div>
            <div className="text-[10px] font-headline text-[#adaaab] uppercase">Fluency Level</div>
          </div>
          <div className="text-[#767576] ml-2"><IconChevron open={expanded} /></div>
        </div>
      </button>

      {expanded && (
        <div className="px-6 py-6 bg-[#1a191b]/40 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h5 className="font-headline text-xs font-bold text-[#adaaab] uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="text-[#ac8aff]"><IconChat /></span> Key Insights
              </h5>
              <div className="space-y-3">
                {session.keyMoments?.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-0.5 h-auto bg-[#ac8aff]/30 rounded-full" />
                    <p className="text-sm text-white/80">{item}</p>
                  </div>
                ))}
                {session.topImprovements?.map((item, i) => (
                  <div key={`imp-${i}`} className="flex gap-4">
                    <div className="flex-shrink-0 w-0.5 h-auto bg-[#ac8aff]/20 rounded-full" />
                    <p className="text-sm text-white/60">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#5516be]/5 p-4 rounded-lg border border-[#5516be]/10">
              <h5 className="font-headline text-xs font-bold text-[#ac8aff] uppercase tracking-widest mb-3">
                Score Matrix
              </h5>
              <div className="space-y-2">
                {skillTags.map((tag) => (
                  <div key={tag.abbr} className="flex justify-between items-center text-xs">
                    <span className="text-[#adaaab]">{tag.label}</span>
                    <span className="font-mono text-white">{tag.score}/5</span>
                  </div>
                ))}
                {session.closingNote && (
                  <p className="text-[#adaaab] text-xs italic mt-3 pt-3 border-t border-white/5">{session.closingNote}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Fluency helpers ───────────────────────────────────────────────────────────

function ratingColor(rating: string) {
  switch (rating) {
    case 'Exceptional':  return 'text-[#9bffce]';
    case 'Proficient':   return 'text-[#85adff]';
    case 'Developing':   return 'text-[#fbbf24]';
    case 'Insufficient': return 'text-[#d7383b]';
    default:             return 'text-[#adaaab]';
  }
}

const CRITERIA_META = [
  { key: 'specificity'      as const, abbr: 'S.C.', label: 'Specificity' },
  { key: 'genaiLiteracy'    as const, abbr: 'G.L.', label: 'GenAI Literacy' },
  { key: 'criticalThinking' as const, abbr: 'C.T.', label: 'Critical Thinking' },
  { key: 'judgment'         as const, abbr: 'J.R.', label: 'Judgment' },
  { key: 'responsibility'   as const, abbr: 'R.E.', label: 'Responsibility' },
  { key: 'learningAgility'  as const, abbr: 'L.A.', label: 'Learning Agility' },
  { key: 'communication'    as const, abbr: 'C.I.', label: 'Communication' },
];

// ── Fluency Session Card ──────────────────────────────────────────────────────

function FluencySessionCard({ session }: { session: FluencySessionRecord }) {
  const [expanded, setExpanded] = useState(false);
  const durationMin = Math.round(session.duration / 60);
  const date = new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const maxTotal = (session.questions?.length ?? 3) * 28;

  return (
    <div className="bg-[#131314] rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-6 flex flex-wrap items-center justify-between gap-6 hover:bg-[#1a191b] transition-colors focus:outline-none"
      >
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-3 mb-1">
            <h4 className="font-headline font-bold text-lg text-white">GenAI Fluency Interview</h4>
            <span className="font-headline text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-[#9bffce]/10 text-[#9bffce] border border-[#9bffce]/20">
              Behavioral
            </span>
            {session.hasRedFlags && (
              <span className="font-headline text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-[#9f0519]/10 text-[#d7383b] border border-[#9f0519]/20">
                Red Flag
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs font-headline text-[#adaaab]">
            <span className="flex items-center gap-1"><IconCalendar />{date}</span>
            <span className="flex items-center gap-1"><IconTimer />{durationMin}m</span>
            <span>{session.questions?.length ?? 3} questions</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {CRITERIA_META.map((c) => (
              <div
                key={c.key}
                title={c.label}
                className="w-9 h-9 rounded bg-[#9bffce]/5 border border-[#9bffce]/15 flex items-center justify-center"
              >
                <span className="text-[9px] font-headline font-bold text-[#9bffce]">{c.abbr}</span>
              </div>
            ))}
          </div>
          <div className="ml-4 text-right">
            <div className={`text-lg font-headline font-bold ${ratingColor(session.rating)}`}>
              {session.totalScore}<span className="text-xs text-[#484849] font-normal">/{maxTotal}</span>
            </div>
            <div className={`text-[10px] font-headline uppercase ${ratingColor(session.rating)}`}>{session.rating}</div>
          </div>
          <div className="text-[#767576] ml-2"><IconChevron open={expanded} /></div>
        </div>
      </button>

      {expanded && (
        <div className="px-6 py-6 bg-[#1a191b]/40 border-t border-white/5 space-y-6">

          {/* Score matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <h5 className="font-headline text-xs font-bold text-[#adaaab] uppercase tracking-widest mb-3">
                Aggregate Scores
              </h5>
              {CRITERIA_META.map((c) => {
                const score = session.aggregateScores?.[c.key] ?? 0;
                const pct = (score / 4) * 100;
                return (
                  <div key={c.key} className="flex items-center gap-3 text-xs">
                    <span className="w-36 shrink-0 text-[#adaaab]">{c.label}</span>
                    <div className="flex-1 bg-[#262627] rounded-full h-1.5 overflow-hidden">
                      <div className="h-full rounded-full bg-[#9bffce]" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="font-mono text-white w-8 text-right">{score.toFixed(1)}/4</span>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#9bffce]/5 p-4 rounded-lg border border-[#9bffce]/10 space-y-3">
              {session.keyStrengths?.length > 0 && (
                <div>
                  <h5 className="font-headline text-[10px] font-bold text-[#9bffce] uppercase tracking-widest mb-1">
                    Strengths
                  </h5>
                  {session.keyStrengths.map((s, i) => (
                    <p key={i} className="text-xs text-white/70 leading-relaxed">{s}</p>
                  ))}
                </div>
              )}
              {session.closingNote && (
                <p className="text-[#adaaab] text-xs italic pt-2 border-t border-white/5">{session.closingNote}</p>
              )}
            </div>
          </div>

          {/* Red flags */}
          {session.hasRedFlags && session.redFlagDetails?.length > 0 && (
            <div className="bg-[#9f0519]/5 rounded-lg p-4 border border-[#9f0519]/20">
              <h5 className="font-headline text-xs font-bold text-[#d7383b] uppercase tracking-widest mb-2">Red Flags</h5>
              {session.redFlagDetails.map((flag, i) => (
                <p key={i} className="text-xs text-[#d7383b]/80">{flag}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [genaiSessions, setGenaiSessions] = useState<GenAISessionRecord[]>([]);
  const [fluencySessions, setFluencySessions] = useState<FluencySessionRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmClearGenai, setConfirmClearGenai] = useState(false);
  const [confirmClearFluency, setConfirmClearFluency] = useState(false);
  const [dailyLimit, setDailyLimit] = useState<{ remaining: number; limit: number } | null>(null);
  const [codingOpen, setCodingOpen] = useState(true);
  const [genaiOpen, setGenaiOpen] = useState(true);
  const [fluencyOpen, setFluencyOpen] = useState(true);
  const [codingShowAll, setCodingShowAll] = useState(false);
  const [genaiShowAll, setGenaiShowAll] = useState(false);
  const [fluencyShowAll, setFluencyShowAll] = useState(false);
  const PREVIEW_COUNT = 3;

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
      // Read localStorage fallback data (for sessions saved before Supabase, or during offline)
      let localInterviews: SessionRecord[] = [];
      let localGenai: GenAISessionRecord[] = [];
      let localFluency: FluencySessionRecord[] = [];
      try { localInterviews = JSON.parse(localStorage.getItem('interview_sessions') ?? '[]'); } catch {}
      try { localGenai = JSON.parse(localStorage.getItem('genai_sessions') ?? '[]'); } catch {}
      try { localFluency = JSON.parse(localStorage.getItem('fluency_sessions') ?? '[]'); } catch {}

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

          // Merge localStorage sessions not already in Supabase (deduped by id)
          const supabaseIds = new Set(interviews.map((s: SessionRecord) => s.id));
          const mergedInterviews = [
            ...interviews,
            ...localInterviews.filter((s) => !supabaseIds.has(s.id)),
          ].sort((a: SessionRecord, b: SessionRecord) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

          const supabaseGenaiIds = new Set(genai.map((s: GenAISessionRecord) => s.id));
          const mergedGenai = [
            ...genai,
            ...localGenai.filter((s) => !supabaseGenaiIds.has(s.id)),
          ].sort((a: GenAISessionRecord, b: GenAISessionRecord) => new Date(b.date).getTime() - new Date(a.date).getTime());

          const fluency = (data.fluencySessions ?? []).map((s: Record<string, unknown>) => ({
            id: s.id as string,
            date: s.created_at as string,
            duration: s.duration as number,
            questions: s.questions as FluencySessionRecord['questions'],
            questionResults: s.question_results as FluencyQuestionResult[],
            aggregateScores: s.aggregate_scores as FluencySessionRecord['aggregateScores'],
            totalScore: s.total_score as number,
            rating: s.rating as string,
            hasRedFlags: s.has_red_flags as boolean,
            redFlagDetails: s.red_flag_details as string[],
            keyStrengths: s.key_strengths as string[],
            keyImprovements: s.key_improvements as string[],
            closingNote: s.closing_note as string,
          }));

          const supabaseFluencyIds = new Set(fluency.map((s: FluencySessionRecord) => s.id));
          const mergedFluency = [
            ...fluency,
            ...localFluency.filter((s) => !supabaseFluencyIds.has(s.id)),
          ].sort((a: FluencySessionRecord, b: FluencySessionRecord) => new Date(b.date).getTime() - new Date(a.date).getTime());

          setSessions(mergedInterviews);
          setGenaiSessions(mergedGenai);
          setFluencySessions(mergedFluency);
          setLoaded(true);
        })
        .catch(() => {
          // Supabase fetch failed — fall back to localStorage entirely
          setSessions(localInterviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
          setGenaiSessions(localGenai.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
          setFluencySessions(localFluency.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
          setLoaded(true);
        });
    } else {
      try {
        const raw = localStorage.getItem('interview_sessions');
        if (raw) {
          const parsed = JSON.parse(raw) as SessionRecord[];
          parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

      try {
        const raw = localStorage.getItem('fluency_sessions');
        if (raw) {
          const parsed = JSON.parse(raw) as FluencySessionRecord[];
          parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setFluencySessions(parsed);
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

  const handleClearFluency = () => {
    if (!confirmClearFluency) { setConfirmClearFluency(true); return; }
    localStorage.removeItem('fluency_sessions');
    setFluencySessions([]);
    setConfirmClearFluency(false);
  };

  const totalSessions = sessions.length + genaiSessions.length + fluencySessions.length;
  const usedToday = dailyLimit ? dailyLimit.limit - dailyLimit.remaining : 0;
  const limitPct = dailyLimit ? (usedToday / dailyLimit.limit) * 100 : 0;

  return (
    <main
      className="min-h-screen bg-[#0e0e0f] text-white"
      style={{
        backgroundImage: 'radial-gradient(circle, #262627 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="w-full px-6 md:px-10 xl:px-16 py-12">

        {/* ── Page Header ── */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-bold font-headline tracking-tighter text-white mb-2">
              Session History
            </h1>
            <div className="flex items-center gap-4">
              <span className="font-headline text-sm text-[#adaaab] flex items-center gap-1.5">
                <IconDatabase />
                {loaded ? totalSessions : '—'} TOTAL SESSIONS
              </span>
              {dailyLimit && (
                <>
                  <div className="h-4 w-px bg-[#484849]/50" />
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[10px] font-headline text-[#adaaab]">
                      <span>DAILY LIMIT</span>
                      <span>{usedToday}/{dailyLimit.limit} USED</span>
                    </div>
                    <div className="w-48 h-1 bg-[#1a191b] rounded-full overflow-hidden">
                      <div
                        className="bg-[#85adff] h-full rounded-full transition-all"
                        style={{ width: `${limitPct}%` }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ── Auth Banner ── */}
        {authLoaded && !isSignedIn && (
          <section
            className="mb-12 p-6 border-t-2 border-[#85adff] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ background: 'rgba(38,38,39,0.6)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#85adff]/20 flex items-center justify-center text-[#85adff] shrink-0">
                <IconUser />
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-white">Guest Mode Active</h3>
                <p className="text-sm text-[#adaaab]">Sign in to sync your progress across devices and unlock permanent history.</p>
              </div>
            </div>
            <SignInButton mode="modal">
              <button className="shrink-0 bg-gradient-to-br from-[#85adff] to-[#6e9fff] text-[#002c66] font-headline font-semibold px-6 py-2.5 rounded-md hover:shadow-[0_0_20px_rgba(133,173,255,0.2)] transition-all whitespace-nowrap">
                Sign in to save progress
              </button>
            </SignInButton>
          </section>
        )}

        {!loaded ? (
          <div className="text-center py-24 text-[#767576] font-headline">Loading…</div>
        ) : totalSessions === 0 ? (
          <div className="text-center py-24">
            <div className="text-[#767576] text-lg font-headline mb-2">No sessions yet</div>
            <p className="text-[#adaaab] text-sm">Complete your first session to see history here.</p>
            <Link
              href="/problems"
              className="inline-block mt-6 px-6 py-2.5 bg-[#85adff] hover:bg-[#6e9fff] text-[#002c66] rounded-md font-headline font-semibold transition-colors"
            >
              Browse Problems
            </Link>
          </div>
        ) : (
          <div className="space-y-12">

            {/* ── Coding Sessions ── */}
            {sessions.length > 0 && (
              <section>
                <div
                  className="flex items-center justify-between mb-6 cursor-pointer group"
                  onClick={() => setCodingOpen((v) => !v)}
                >
                  <h2 className="font-headline font-bold text-xl flex items-center gap-3">
                    <span className="text-[#85adff]"><IconTerminal /></span>
                    CODING SESSIONS
                  </h2>
                  <div className="flex items-center gap-3">
                    {!isSignedIn && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleClear(); }}
                        onBlur={() => setConfirmClear(false)}
                        className={`text-xs px-3 py-1.5 rounded border font-headline transition-colors ${
                          confirmClear
                            ? 'bg-[#9f0519] border-[#9f0519] text-white'
                            : 'bg-transparent border-[#484849]/50 text-[#767576] hover:text-[#d7383b] hover:border-[#9f0519]/50'
                        }`}
                      >
                        {confirmClear ? 'Confirm?' : 'Clear'}
                      </button>
                    )}
                    <span className="text-[#767576] group-hover:text-white transition-colors">
                      <IconChevron open={codingOpen} />
                    </span>
                  </div>
                </div>
                {codingOpen && (
                  <div className="space-y-4">
                    {(codingShowAll ? sessions : sessions.slice(0, PREVIEW_COUNT)).map((session) => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                    {sessions.length > PREVIEW_COUNT && (
                      <button
                        onClick={() => setCodingShowAll((v) => !v)}
                        className="w-full text-xs px-3 py-2 rounded border border-[#484849]/50 text-[#767576] hover:text-white hover:border-[#85adff]/50 font-headline transition-colors"
                      >
                        {codingShowAll ? 'Show fewer' : `Show all (${sessions.length})`}
                      </button>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* ── GenAI Coding ── */}
            {genaiSessions.length > 0 && (
              <section>
                <div
                  className="flex items-center justify-between mb-6 cursor-pointer group"
                  onClick={() => setGenaiOpen((v) => !v)}
                >
                  <h2 className="font-headline font-bold text-xl flex items-center gap-3">
                    <span className="text-[#ac8aff]"><IconBrain /></span>
                    GENAI CODING
                  </h2>
                  <div className="flex items-center gap-3">
                    {!isSignedIn && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleClearGenai(); }}
                        onBlur={() => setConfirmClearGenai(false)}
                        className={`text-xs px-3 py-1.5 rounded border font-headline transition-colors ${
                          confirmClearGenai
                            ? 'bg-[#9f0519] border-[#9f0519] text-white'
                            : 'bg-transparent border-[#484849]/50 text-[#767576] hover:text-[#d7383b] hover:border-[#9f0519]/50'
                        }`}
                      >
                        {confirmClearGenai ? 'Confirm?' : 'Clear'}
                      </button>
                    )}
                    <span className="text-[#767576] group-hover:text-white transition-colors">
                      <IconChevron open={genaiOpen} />
                    </span>
                  </div>
                </div>
                {genaiOpen && (
                  <div className="space-y-4">
                    {(genaiShowAll ? genaiSessions : genaiSessions.slice(0, PREVIEW_COUNT)).map((session) => (
                      <GenAISessionCard key={session.id} session={session} />
                    ))}
                    {genaiSessions.length > PREVIEW_COUNT && (
                      <button
                        onClick={() => setGenaiShowAll((v) => !v)}
                        className="w-full text-xs px-3 py-2 rounded border border-[#484849]/50 text-[#767576] hover:text-white hover:border-[#ac8aff]/50 font-headline transition-colors"
                      >
                        {genaiShowAll ? 'Show fewer' : `Show all (${genaiSessions.length})`}
                      </button>
                    )}
                  </div>
                )}
              </section>
            )}

            {/* ── GenAI Fluency ── */}
            {fluencySessions.length > 0 && (
              <section>
                <div
                  className="flex items-center justify-between mb-6 cursor-pointer group"
                  onClick={() => setFluencyOpen((v) => !v)}
                >
                  <h2 className="font-headline font-bold text-xl flex items-center gap-3">
                    <span className="text-[#9bffce]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                      </svg>
                    </span>
                    GENAI FLUENCY
                  </h2>
                  <div className="flex items-center gap-3">
                    {!isSignedIn && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleClearFluency(); }}
                        onBlur={() => setConfirmClearFluency(false)}
                        className={`text-xs px-3 py-1.5 rounded border font-headline transition-colors ${
                          confirmClearFluency
                            ? 'bg-[#9f0519] border-[#9f0519] text-white'
                            : 'bg-transparent border-[#484849]/50 text-[#767576] hover:text-[#d7383b] hover:border-[#9f0519]/50'
                        }`}
                      >
                        {confirmClearFluency ? 'Confirm?' : 'Clear'}
                      </button>
                    )}
                    <span className="text-[#767576] group-hover:text-white transition-colors">
                      <IconChevron open={fluencyOpen} />
                    </span>
                  </div>
                </div>
                {fluencyOpen && (
                  <div className="space-y-4">
                    {(fluencyShowAll ? fluencySessions : fluencySessions.slice(0, PREVIEW_COUNT)).map((session) => (
                      <FluencySessionCard key={session.id} session={session} />
                    ))}
                    {fluencySessions.length > PREVIEW_COUNT && (
                      <button
                        onClick={() => setFluencyShowAll((v) => !v)}
                        className="w-full text-xs px-3 py-2 rounded border border-[#484849]/50 text-[#767576] hover:text-white hover:border-[#9bffce]/50 font-headline transition-colors"
                      >
                        {fluencyShowAll ? 'Show fewer' : `Show all (${fluencySessions.length})`}
                      </button>
                    )}
                  </div>
                )}
              </section>
            )}

          </div>
        )}
      </div>
    </main>
  );
}
