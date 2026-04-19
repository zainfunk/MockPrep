import Link from 'next/link';
import { Space_Grotesk, JetBrains_Mono, Space_Mono } from 'next/font/google';
import AnimateIn from '@/components/AnimateIn';
import TypewriterWord from '@/components/TypewriterWord';
import HeroShowcase from '@/components/HeroShowcase';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'] });

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconChat() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconBarChart() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconHistory() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v5h5" />
      <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

function IconTerminal() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function IconLightbulb() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21h6" />
      <path d="M10 17.5h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.6.5 1 1.2 1 2V15h6v-.5c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" />
    </svg>
  );
}

// ── Section label ──────────────────────────────────────────────────────────────

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-slate-400 dark:text-slate-600 text-xs font-mono">{'// '}{index}</span>
      <div className="h-px w-6 bg-slate-300 dark:bg-slate-700" />
      <span className="text-slate-400 dark:text-slate-500 text-xs font-mono tracking-widest uppercase">{label}</span>
    </div>
  );
}

// ── Feature card ───────────────────────────────────────────────────────────────

type Accent = 'blue' | 'green' | 'amber' | 'violet' | 'cyan' | 'rose';

const accents: Record<Accent, { leftBorder: string; iconWrap: string; iconText: string; tag: string }> = {
  blue:   { leftBorder: 'border-l-blue-500/50',   iconWrap: 'bg-blue-500/10 border-blue-500/20',   iconText: 'text-blue-600 dark:text-blue-400',   tag: 'border-blue-500/25 text-blue-600/80 dark:text-blue-400/80' },
  green:  { leftBorder: 'border-l-green-500/50',  iconWrap: 'bg-green-500/10 border-green-500/20', iconText: 'text-green-600 dark:text-green-400',  tag: 'border-green-500/25 text-green-600/80 dark:text-green-400/80' },
  amber:  { leftBorder: 'border-l-amber-500/50',  iconWrap: 'bg-amber-500/10 border-amber-500/20', iconText: 'text-amber-600 dark:text-amber-400',  tag: 'border-amber-500/25 text-amber-600/80 dark:text-amber-400/80' },
  violet: { leftBorder: 'border-l-violet-500/50', iconWrap: 'bg-violet-500/10 border-violet-500/20', iconText: 'text-violet-600 dark:text-violet-400', tag: 'border-violet-500/25 text-violet-600/80 dark:text-violet-400/80' },
  cyan:   { leftBorder: 'border-l-cyan-500/50',   iconWrap: 'bg-cyan-500/10 border-cyan-500/20',   iconText: 'text-cyan-600 dark:text-cyan-400',   tag: 'border-cyan-500/25 text-cyan-600/80 dark:text-cyan-400/80' },
  rose:   { leftBorder: 'border-l-rose-500/50',   iconWrap: 'bg-rose-500/10 border-rose-500/20',   iconText: 'text-rose-600 dark:text-rose-400',   tag: 'border-rose-500/25 text-rose-600/80 dark:text-rose-400/80' },
};

function FeatureCard({
  idx,
  icon,
  title,
  description,
  accent = 'blue',
  extra,
}: {
  idx: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: Accent;
  extra?: React.ReactNode;
}) {
  const a = accents[accent];
  return (
    <div className={`h-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 border-l-4 ${a.leftBorder} rounded-lg p-6 flex flex-col gap-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]`}>
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-md border flex items-center justify-center ${a.iconWrap} ${a.iconText}`}>
          {icon}
        </div>
        <span className={`text-[10px] font-mono border px-2 py-0.5 rounded-sm ${a.tag}`}>
          [{idx}]
        </span>
      </div>
      <div className="flex-1">
        <h3 className="text-slate-800 dark:text-slate-100 font-semibold mb-2">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
      </div>
      {extra && <div className="mt-auto pt-2">{extra}</div>}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className={`${spaceGrotesk.className} ${jetbrainsMono.variable} min-h-screen bg-slate-50 dark:bg-[#0e0e0f] text-slate-900 dark:text-slate-100`}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden lg:min-h-[calc(100vh-3.5rem)] lg:flex lg:items-center">
        {/* Dot grid */}
        <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid" />
        {/* Bottom fade */}
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 hero-fade" />

        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 pt-14 pb-28 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left - text */}
            <div>
              <h1 className={`${spaceMono.className} text-4xl xl:text-5xl font-bold text-slate-900 dark:text-slate-50 leading-snug tracking-normal mb-6`}>
                Simulated interviews for the{' '}
                <span className="text-purple-600 dark:text-purple-400">next generation</span>
                {' '}
                <span className="text-blue-600 dark:text-blue-400">of </span><TypewriterWord /><span className="text-blue-600 dark:text-blue-400">.</span>
              </h1>

              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
                Practice with an AI interviewer that asks follow-up questions, adapts to your answers, and gives you honest feedback. Not just a pass or fail. No payment required.
              </p>

              <div className="flex">
                <Link
                  href="/problems"
                  className="btn-glow-green inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white dark:text-[#0F172A] font-bold px-10 py-4 rounded-lg text-lg cursor-pointer"
                >
                  Start Practicing
                  <IconArrow />
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-10 mt-12 pt-10 border-t border-slate-200 dark:border-slate-800">
                {[['100+', 'problems'], ['45m', 'timed_sessions'], ['3', 'interview_tracks']].map(([val, label]) => (
                  <div key={label}>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-50 font-mono">{val}</div>
                    <div className="text-slate-400 dark:text-slate-600 text-xs mt-0.5 font-mono">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - showcase tabs */}
            <HeroShowcase
              items={[
                {
                  icon: <IconChat />,
                  title: 'Live AI interviewer',
                  accent: 'blue',
                  filename: 'live_session.log',
                  demo: (
                    <div className="space-y-3.5 text-sm">
                      <div>
                        <span className="text-blue-600 dark:text-blue-400 text-xs font-mono">AI ▸</span>
                        <div className="ml-5 border-l-2 border-blue-500/40 pl-3 py-1.5 text-slate-600 dark:text-slate-300 leading-relaxed">
                          Walk me through your approach before writing any code.
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-300 text-xs font-mono">YOU ▸</span>
                        <div className="ml-5 border-l-2 border-slate-400/40 pl-3 py-1.5 text-slate-700 dark:text-slate-200 leading-relaxed">
                          I&apos;d use two pointers — one at the start, one at the end.
                        </div>
                      </div>
                      <div>
                        <span className="text-blue-600 dark:text-blue-400 text-xs font-mono">AI ▸</span>
                        <div className="ml-5 border-l-2 border-blue-500/40 pl-3 py-1.5 text-slate-600 dark:text-slate-300 leading-relaxed">
                          What changes if the input isn&apos;t sorted?
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-300 text-xs font-mono">YOU ▸</span>
                        <div className="ml-5 border-l-2 border-slate-400/40 pl-3 py-2.5 flex items-center">
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  icon: <IconTerminal />,
                  title: 'Traditional Coding',
                  accent: 'cyan',
                  filename: 'two_sum.py',
                  demo: (
                    <div>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 tracking-wider">TRADITIONAL CODING</span>
                        <span className="text-slate-400 dark:text-slate-600 text-[10px] font-mono">65+ problems</span>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[13px] text-slate-800 dark:text-slate-100">two_sum</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm border border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/10 uppercase tracking-wider">easy</span>
                      </div>

                      <pre className="bg-slate-100 dark:bg-[#0e0e0f]/60 border border-slate-200 dark:border-slate-700/50 rounded-md p-3 text-slate-700 dark:text-slate-200 text-[12px] leading-relaxed font-mono overflow-x-auto">
{`def two_sum(nums, target):
    # return indices of two nums
    # that sum to target`}
                      </pre>

                      <div className="mt-3 space-y-1 text-[12px] font-mono">
                        <div className="text-slate-400 dark:text-slate-600 text-[10px] mb-1">{'// test cases'}</div>
                        <div className="flex gap-2">
                          <span className="text-cyan-600 dark:text-cyan-400 shrink-0">▸</span>
                          <span className="text-slate-600 dark:text-slate-400">[2,7,11,15] t=9 <span className="text-slate-400 dark:text-slate-600">→</span> [0,1]</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-cyan-600 dark:text-cyan-400 shrink-0">▸</span>
                          <span className="text-slate-600 dark:text-slate-400">[3,2,4] t=6 <span className="text-slate-400 dark:text-slate-600">→</span> [1,2]</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-cyan-600 dark:text-cyan-400 shrink-0">▸</span>
                          <span className="text-slate-600 dark:text-slate-400">[3,3] t=6 <span className="text-slate-400 dark:text-slate-600">→</span> [0,1]</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/50 flex items-center gap-2 text-[10px] font-mono flex-wrap">
                        <span className="text-slate-400 dark:text-slate-600">{'// difficulty:'}</span>
                        <span className="px-1.5 py-0.5 rounded-sm border border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/10">easy</span>
                        <span className="px-1.5 py-0.5 rounded-sm border border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10">medium</span>
                        <span className="px-1.5 py-0.5 rounded-sm border border-rose-500/30 text-rose-500 dark:text-rose-400 bg-rose-500/10">hard</span>
                      </div>
                    </div>
                  ),
                },
                {
                  icon: <IconCode />,
                  title: 'GenAI Coding',
                  accent: 'green',
                  filename: 'genai_review.py',
                  demo: (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm border border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/10">AI OUTPUT</span>
                        <span className="text-slate-400 dark:text-slate-600 text-[10px] font-mono">auto-generated</span>
                      </div>
                      <pre className="bg-slate-100 dark:bg-[#0e0e0f]/60 border border-slate-200 dark:border-slate-700/50 rounded-md p-3 text-slate-700 dark:text-slate-200 text-[12px] leading-relaxed font-mono overflow-x-auto">
{`def average(nums):
    return sum(nums) / len(nums)`}
                      </pre>
                      <div className="mt-4 space-y-2 text-[12px] font-mono">
                        <div className="flex gap-2">
                          <span className="text-amber-600 dark:text-amber-400 font-semibold shrink-0 w-12">ISSUE</span>
                          <span className="text-slate-600 dark:text-slate-400">ZeroDivisionError on empty input</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-green-600 dark:text-green-400 font-semibold shrink-0 w-12">FIX</span>
                          <span className="text-slate-600 dark:text-slate-400">guard len(nums) &gt; 0 before dividing</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-blue-600 dark:text-blue-400 font-semibold shrink-0 w-12">YOU</span>
                          <span className="text-slate-600 dark:text-slate-400">explain the fix to the interviewer</span>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  icon: <IconLightbulb />,
                  title: 'GenAI Fluency',
                  accent: 'violet',
                  filename: 'genai_fluency.interview',
                  demo: (
                    <div>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm border border-violet-500/30 text-violet-600 dark:text-violet-400 bg-violet-500/10 tracking-wider">BEHAVIORAL · STAR</span>
                        <span className="text-slate-400 dark:text-slate-600 text-[10px] font-mono">judgment_&amp;_risk</span>
                      </div>

                      <div className="space-y-3 text-sm mb-3">
                        <div>
                          <span className="text-violet-600 dark:text-violet-400 text-xs font-mono">AI ▸</span>
                          <div className="ml-5 border-l-2 border-violet-500/40 pl-3 py-1.5 text-slate-600 dark:text-slate-300 leading-relaxed">
                            Tell me about a time you chose NOT to use an AI tool on a project. Why?
                          </div>
                        </div>
                        <div>
                          <span className="text-slate-600 dark:text-slate-300 text-xs font-mono">YOU ▸</span>
                          <div className="ml-5 border-l-2 border-slate-400/40 pl-3 py-2 space-y-1 font-mono text-[12px]">
                            <div className="flex gap-2"><span className="text-violet-600 dark:text-violet-400 font-semibold w-4 shrink-0">S</span><span className="text-slate-700 dark:text-slate-200">migrating auth in a billing service</span></div>
                            <div className="flex gap-2"><span className="text-violet-600 dark:text-violet-400 font-semibold w-4 shrink-0">T</span><span className="text-slate-700 dark:text-slate-200">refactor without breaking prod</span></div>
                            <div className="flex gap-2"><span className="text-violet-600 dark:text-violet-400 font-semibold w-4 shrink-0">A</span><span className="text-slate-700 dark:text-slate-200">skipped AI — code was security-critical</span></div>
                            <div className="flex gap-2"><span className="text-violet-600 dark:text-violet-400 font-semibold w-4 shrink-0">R</span><span className="text-slate-500 dark:text-slate-500 italic">typing…</span></div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700/50 flex items-start gap-2 text-[11px] font-mono">
                        <span className="text-violet-600 dark:text-violet-400 font-semibold shrink-0">EVAL</span>
                        <span className="text-slate-500 dark:text-slate-400">judgment · risk awareness · communication</span>
                      </div>
                    </div>
                  ),
                },
                {
                  icon: <IconBarChart />,
                  title: 'Honest scored feedback',
                  accent: 'amber',
                  filename: 'session_report.json',
                  demo: (
                    <div className="space-y-4">
                      <div className="space-y-2.5">
                        {[
                          { label: 'communication', val: 8, bar: 80 },
                          { label: 'problem_solving', val: 7, bar: 70 },
                          { label: 'code_quality', val: 9, bar: 90 },
                        ].map(({ label, val, bar }) => (
                          <div key={label}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-slate-500 dark:text-slate-400 text-xs font-mono">{label}</span>
                              <span className="font-mono">
                                <span className="text-amber-600 dark:text-amber-400 text-sm font-semibold">{val}</span>
                                <span className="text-slate-300 dark:text-slate-700 text-[11px]">/10</span>
                              </span>
                            </div>
                            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500/60 rounded-full" style={{ width: `${bar}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700/50 space-y-1.5">
                        <span className="text-slate-400 dark:text-slate-600 text-[10px] font-mono">{'// key_moments'}</span>
                        <div className="flex gap-2 text-[12px] font-mono">
                          <span className="text-green-600 dark:text-green-400 font-semibold shrink-0">+</span>
                          <span className="text-slate-600 dark:text-slate-400">caught an off-by-one edge case unprompted</span>
                        </div>
                        <div className="flex gap-2 text-[12px] font-mono">
                          <span className="text-rose-500 dark:text-rose-400 font-semibold shrink-0">−</span>
                          <span className="text-slate-600 dark:text-slate-400">skipped discussing time complexity</span>
                        </div>
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── GENAI READINESS ─────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 dark:border-slate-800/60 relative overflow-hidden">
        {/* Dual ambient — green for Coding, violet for Fluency */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 45% 55% at 15% 40%, rgba(34,197,94,0.06) 0%, transparent 65%), radial-gradient(ellipse 45% 55% at 85% 60%, rgba(139,92,246,0.06) 0%, transparent 65%)' }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24">

          <AnimateIn className="mb-14">
            <SectionLabel index="001" label="GenAI Readiness" />
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4 leading-tight">
                Two skills every engineer needs in the AI era.{' '}
                <span className="text-green-600 dark:text-green-400">Almost no one</span>{' '}
                <span className="text-violet-600 dark:text-violet-400">is training for either.</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed">
                AI is rewriting software engineering in real time. Shipping is no longer the bar — the engineers who stand out are the ones who can direct AI effectively <em>and</em> defend that judgment out loud. Placed is the only prep platform that trains both: the hands-on work, and the conversation.
              </p>
            </div>
          </AnimateIn>

          {/* Two-track showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

            {/* GenAI Coding */}
            <AnimateIn>
              <div className="relative h-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 border-t-4 border-t-green-500/60 rounded-lg p-8 flex flex-col gap-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm border border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/10 tracking-wider">TECHNICAL · CODING</span>
                    <h3 className="text-slate-900 dark:text-slate-50 text-2xl font-bold mt-3 mb-2">GenAI Coding</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Scenarios where the AI output looks right but isn&apos;t. You catch the issue, fix it, and own the result — the way real engineering teams ship AI-assisted code.
                    </p>
                  </div>
                  <div className="w-10 h-10 shrink-0 rounded-md border bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center">
                    <IconCode />
                  </div>
                </div>

                <ul className="space-y-3.5">
                  {[
                    { label: 'prompt_quality',     title: 'Prompt Quality',     desc: 'Write precise, constrained prompts that produce useful output — not hopeful one-liners.' },
                    { label: 'output_validation',  title: 'Output Validation',  desc: 'Catch logic errors, off-by-ones, and edge-case failures before they reach production.' },
                    { label: 'debugging_ai_code',  title: 'Debugging AI Code',  desc: 'Reason through AI output fast: is the bug in the logic, the spec, or your prompt?' },
                    { label: 'full_ownership',     title: 'Full Ownership',     desc: 'Ship the code as your own. Explain every line as if you wrote it yourself — because you did.' },
                  ].map(({ label, title, desc }) => (
                    <li key={label} className="flex items-start gap-3">
                      <span className="text-green-500/70 shrink-0 mt-1 font-mono text-xs select-none">▸</span>
                      <div>
                        <span className="text-[10px] font-mono text-green-600/80 dark:text-green-400/70">{label}</span>
                        <div className="text-slate-800 dark:text-slate-100 font-semibold text-sm mt-0.5">{title}</div>
                        <div className="text-slate-500 text-xs mt-1 leading-relaxed">{desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/problems?tab=genai"
                  className="mt-auto inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 font-semibold text-sm transition-colors"
                >
                  Try GenAI Coding
                  <IconArrow />
                </Link>
              </div>
            </AnimateIn>

            {/* GenAI Fluency */}
            <AnimateIn delay={120}>
              <div className="relative h-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 border-t-4 border-t-violet-500/60 rounded-lg p-8 flex flex-col gap-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm border border-violet-500/30 text-violet-600 dark:text-violet-400 bg-violet-500/10 tracking-wider">BEHAVIORAL · STAR</span>
                    <h3 className="text-slate-900 dark:text-slate-50 text-2xl font-bold mt-3 mb-2">GenAI Fluency</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Behavioral rounds now probe how you think about AI — when you reach for it, when you don&apos;t, and who owns what ships. Practice the conversation, not just the code.
                    </p>
                  </div>
                  <div className="w-10 h-10 shrink-0 rounded-md border bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                    <IconLightbulb />
                  </div>
                </div>

                <ul className="space-y-3.5">
                  {[
                    { label: 'situational_judgment', title: 'Situational Judgment', desc: 'Know when to reach for AI — and when not to. Defend that call with specifics.' },
                    { label: 'risk_awareness',       title: 'Risk Awareness',       desc: 'Identify where AI output is most likely to fail and why that matters in context.' },
                    { label: 'star_framing',         title: 'STAR Framing',         desc: 'Structure real AI stories — situation, task, action, result — interviewers can follow.' },
                    { label: 'accountability',       title: 'Accountability',       desc: 'Articulate how you own AI-assisted work without hiding behind the tool.' },
                  ].map(({ label, title, desc }) => (
                    <li key={label} className="flex items-start gap-3">
                      <span className="text-violet-500/70 shrink-0 mt-1 font-mono text-xs select-none">▸</span>
                      <div>
                        <span className="text-[10px] font-mono text-violet-600/80 dark:text-violet-400/70">{label}</span>
                        <div className="text-slate-800 dark:text-slate-100 font-semibold text-sm mt-0.5">{title}</div>
                        <div className="text-slate-500 text-xs mt-1 leading-relaxed">{desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/problems?tab=fluency"
                  className="mt-auto inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 font-semibold text-sm transition-colors"
                >
                  Try GenAI Fluency
                  <IconArrow />
                </Link>
              </div>
            </AnimateIn>
          </div>

          {/* Bottom statement */}
          <AnimateIn delay={200}>
            <div className="border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-[#1E293B]/40 rounded-lg px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-slate-700 dark:text-slate-200 font-semibold mb-1">
                  No other interview prep platform tests either of these.
                </p>
                <p className="text-slate-500 text-sm">
                  Both tracks are free to practice, no account required. The AI era needs engineers who can ship <em>and</em> defend their work — we help you train for both.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href="/problems?tab=genai"
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white dark:text-[#0F172A] font-bold px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  GenAI Coding
                  <IconArrow />
                </Link>
                <Link
                  href="/problems?tab=fluency"
                  className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  GenAI Fluency
                  <IconArrow />
                </Link>
              </div>
            </div>
          </AnimateIn>

        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <AnimateIn className="mb-12">
            <SectionLabel index="002" label="Features" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3">Built around real interview mechanics</h2>
            <p className="text-slate-500 text-lg max-w-xl">
              Every feature exists because real technical interviews demand it — including the ones that test how well you work with AI.
            </p>
          </AnimateIn>

          <AnimateIn delay={100}>
            {/* Alternating bento: 2+1, 1+2, 2+1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Row 1 */}
              <div className="md:col-span-2">
                <FeatureCard
                  idx="01"
                  icon={<IconChat />}
                  accent="blue"
                  title="Live AI Interviewer"
                  description="Back-and-forth conversation. The AI probes your reasoning, challenges assumptions, and guides you with hints, just like a human interviewer in a real loop."
                  extra={
                    <div className="flex gap-2 flex-wrap">
                      {['socratic_method', 'follow_ups', 'adaptive_hints'].map(tag => (
                        <span key={tag} className="text-[11px] font-mono border border-blue-500/20 text-blue-600/70 dark:text-blue-400/70 px-2 py-0.5 rounded-sm">{tag}</span>
                      ))}
                    </div>
                  }
                />
              </div>
              <div>
                <FeatureCard
                  idx="02"
                  icon={<IconBarChart />}
                  accent="green"
                  title="Honest Scored Feedback"
                  description="Every session ends with a report scoring communication, problem-solving, and code quality on a 1–10 scale with written explanations."
                />
              </div>

              {/* Row 2 */}
              <div>
                <FeatureCard
                  idx="03"
                  icon={<IconCode />}
                  accent="violet"
                  title="Full Code Editor"
                  description="Write real code in Python, JavaScript, Java, or C++ inside a Monaco editor with syntax highlighting and a resizable split-pane layout."
                />
              </div>
              <div className="md:col-span-2">
                <FeatureCard
                  idx="04"
                  icon={<IconLayers />}
                  accent="cyan"
                  title="Two Problem Tracks"
                  description="20 curated coding problems for traditional interview prep, plus 10 GenAI Coding assessments built around scenarios where AI produces plausible-but-flawed output. Practice both, because both matter."
                  extra={
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { label: 'coding_problems', cls: 'border-cyan-500/25 text-cyan-600/80 dark:text-cyan-400/80' },
                        { label: 'genai_fluency', cls: 'border-violet-500/25 text-violet-600/80 dark:text-violet-400/80' },
                      ].map(({ label, cls }) => (
                        <span key={label} className={`text-[11px] font-mono border px-2 py-0.5 rounded-sm ${cls}`}>{label}</span>
                      ))}
                    </div>
                  }
                />
              </div>

              {/* Row 3 */}
              <div className="md:col-span-2">
                <FeatureCard
                  idx="05"
                  icon={<IconClock />}
                  accent="amber"
                  title="Timed 45-Minute Sessions"
                  description="Practice under real interview time constraints. A live countdown keeps you on pace, and your time management is reflected in your final score."
                  extra={
                    <div className="flex items-center gap-3">
                      <div className="h-1 flex-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full w-[58%] bg-amber-500/50 rounded-full" />
                      </div>
                      <span className="text-slate-400 dark:text-slate-600 text-[11px] font-mono shrink-0">26:14 / 45:00</span>
                    </div>
                  }
                />
              </div>
              <div>
                <FeatureCard
                  idx="06"
                  icon={<IconHistory />}
                  accent="rose"
                  title="Session History"
                  description="Every completed session is saved so you can review scores, re-read feedback, and see exactly where you've improved over time."
                />
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <AnimateIn className="mb-12">
            <SectionLabel index="003" label="Pricing" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3">
              Start free. <span className="text-blue-600 dark:text-blue-400">Upgrade</span> when you&apos;re ready.
            </h2>
            <p className="text-slate-500 text-lg max-w-xl">
              Two plans, one product. Pick what matches how hard you&apos;re prepping — switch whenever.
            </p>
          </AnimateIn>

          <AnimateIn delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

              {/* Free */}
              <div className="h-full bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 border-t-4 border-t-slate-400/50 rounded-lg p-8 flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm border border-slate-400/30 text-slate-500 dark:text-slate-400 bg-slate-500/5 tracking-wider">FREE</span>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-600">[00]</span>
                </div>
                <h3 className="text-slate-900 dark:text-slate-50 text-2xl font-bold mb-1">Free</h3>
                <p className="text-slate-500 text-sm mb-5">Try Placed, get a feel for it.</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900 dark:text-slate-50 font-mono">$0</span>
                  <span className="text-slate-500 text-sm font-mono ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    { label: 'sessions_per_month', value: '2 sessions' },
                    { label: 'interview_tracks', value: 'All 3 tracks' },
                    { label: 'scored_feedback', value: 'Honest scored reports' },
                    { label: 'session_history', value: 'Full history' },
                  ].map(({ label, value }) => (
                    <li key={label} className="flex items-start gap-3">
                      <span className="text-slate-400 shrink-0 mt-1 font-mono text-xs select-none">▸</span>
                      <div>
                        <div className="text-slate-800 dark:text-slate-100 text-sm font-semibold">{value}</div>
                        <div className="text-[10px] font-mono text-slate-400 dark:text-slate-600">{label}</div>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/problems"
                  className="mt-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold px-6 py-3 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Start free
                  <IconArrow />
                </Link>
              </div>

              {/* Pro */}
              <div className="relative h-full bg-white dark:bg-[#1E293B] border border-blue-500/40 border-t-4 border-t-blue-500 rounded-lg p-8 flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(59,130,246,0.2)] dark:hover:shadow-[0_8px_32px_rgba(59,130,246,0.25)]">
                <div className="absolute -top-3 right-6 rounded-full bg-blue-500 text-white text-[10px] font-mono px-3 py-1 tracking-wider uppercase shadow-lg shadow-blue-500/30">
                  Recommended
                </div>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm border border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10 tracking-wider">PRO</span>
                  <span className="text-[10px] font-mono text-blue-600/60 dark:text-blue-400/60">[01]</span>
                </div>
                <h3 className="text-slate-900 dark:text-slate-50 text-2xl font-bold mb-1">Pro</h3>
                <p className="text-slate-500 text-sm mb-5">Practice like you mean it.</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900 dark:text-slate-50 font-mono">$19</span>
                  <span className="text-slate-500 text-sm font-mono ml-1">/month</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {[
                    { label: 'sessions_per_month', value: '20 sessions' },
                    { label: 'interview_tracks', value: 'All 3 tracks' },
                    { label: 'scored_feedback', value: 'Honest scored reports' },
                    { label: 'session_history', value: 'Full history & exports' },
                    { label: 'cancellation', value: 'Cancel anytime' },
                  ].map(({ label, value }) => (
                    <li key={label} className="flex items-start gap-3">
                      <span className="text-blue-500/80 shrink-0 mt-1 font-mono text-xs select-none">▸</span>
                      <div>
                        <div className="text-slate-800 dark:text-slate-100 text-sm font-semibold">{value}</div>
                        <div className="text-[10px] font-mono text-blue-600/70 dark:text-blue-400/70">{label}</div>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pricing"
                  className="mt-auto btn-glow-blue inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-3 rounded-lg text-sm transition-colors cursor-pointer"
                >
                  Upgrade to Pro
                  <IconArrow />
                </Link>
              </div>

            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 dark:border-slate-800/60">
        <AnimateIn>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <div className="text-xs font-mono text-slate-400 dark:text-slate-600 mb-3">{'// ready when you are'}</div>
              <h2 className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-3">
                Find out where you stand.
              </h2>
              <p className="text-slate-500 text-lg max-w-lg">
                Coding fundamentals or GenAI fluency — pick a track and start your first session right now.
              </p>
            </div>
            <Link
              href="/problems"
              className="btn-glow-green shrink-0 inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white dark:text-[#0F172A] font-bold px-8 py-4 rounded-lg text-base cursor-pointer"
            >
              Start Practicing
              <IconArrow />
            </Link>
          </div>
        </AnimateIn>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-slate-400 dark:text-slate-600 text-sm font-mono font-semibold">Placed</span>
          <div className="flex items-center gap-6 text-sm font-mono">
            <Link href="/problems" className="text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">problems</Link>
            <Link href="/history" className="text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">history</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
