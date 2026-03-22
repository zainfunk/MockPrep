import Link from 'next/link';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import AnimateIn from '@/components/AnimateIn';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

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

function IconArrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
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

// ── Section label ──────────────────────────────────────────────────────────────

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-slate-600 text-xs font-mono">{'// '}{index}</span>
      <div className="h-px w-6 bg-slate-700" />
      <span className="text-slate-500 text-xs font-mono tracking-widest uppercase">{label}</span>
    </div>
  );
}

// ── Mock interview preview ─────────────────────────────────────────────────────

function InterviewPreview() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-2xl blur-3xl opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.5) 0%, transparent 70%)' }}
      />
      {/* Window */}
      <div className="relative bg-[#1E293B] border border-slate-700/50 rounded-lg overflow-hidden shadow-2xl">

        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/50 bg-[#0F172A]/80">
          <div className="flex gap-1.5 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs font-mono">two_sum.py</span>
            <span className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-mono px-2 py-0.5 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </span>
          </div>
          <span className="text-slate-500 text-xs font-mono">38:14</span>
        </div>

        {/* Chat */}
        <div className="p-5 space-y-4 text-sm">
          <div className="space-y-1.5">
            <span className="text-green-400 text-xs font-mono">AI ▸</span>
            <div className="ml-5 border-l-2 border-green-500/40 pl-3 py-2 text-slate-300 leading-relaxed">
              Good start. Before writing code, what data structure are you thinking of using, and why?
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-blue-400 text-xs font-mono">YOU ▸</span>
            <div className="ml-5 border-l-2 border-blue-500/40 pl-3 py-2 text-slate-200 leading-relaxed">
              I&apos;d use a hash map to store each number and its index as I iterate.
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-green-400 text-xs font-mono">AI ▸</span>
            <div className="ml-5 border-l-2 border-green-500/40 pl-3 py-2 text-slate-300 leading-relaxed">
              Correct. What&apos;s the time and space complexity of that approach?
            </div>
          </div>
          <div className="space-y-1.5">
            <span className="text-blue-400 text-xs font-mono">YOU ▸</span>
            <div className="ml-5 border-l-2 border-blue-500/40 pl-3 py-3 flex items-center">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Score strip */}
        <div className="border-t border-slate-700/50 px-5 py-3 bg-[#0F172A]/70 flex items-center justify-between">
          <span className="text-slate-600 text-[11px] font-mono">{'// session_score'}</span>
          <div className="flex gap-4">
            {[['comm', '8'], ['logic', '7'], ['code', '9']].map(([label, val]) => (
              <div key={label} className="flex items-baseline gap-1">
                <span className="text-slate-600 text-[10px] font-mono">{label}:</span>
                <span className="text-green-400 text-sm font-semibold font-mono">{val}</span>
                <span className="text-slate-700 text-[10px] font-mono">/10</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Feature card ───────────────────────────────────────────────────────────────

type Accent = 'blue' | 'green' | 'amber' | 'violet' | 'cyan' | 'rose';

const accents: Record<Accent, { leftBorder: string; iconWrap: string; iconText: string; tag: string }> = {
  blue:   { leftBorder: 'border-l-blue-500/50',   iconWrap: 'bg-blue-500/10 border-blue-500/20',   iconText: 'text-blue-400',   tag: 'border-blue-500/25 text-blue-400/80' },
  green:  { leftBorder: 'border-l-green-500/50',  iconWrap: 'bg-green-500/10 border-green-500/20', iconText: 'text-green-400',  tag: 'border-green-500/25 text-green-400/80' },
  amber:  { leftBorder: 'border-l-amber-500/50',  iconWrap: 'bg-amber-500/10 border-amber-500/20', iconText: 'text-amber-400',  tag: 'border-amber-500/25 text-amber-400/80' },
  violet: { leftBorder: 'border-l-violet-500/50', iconWrap: 'bg-violet-500/10 border-violet-500/20', iconText: 'text-violet-400', tag: 'border-violet-500/25 text-violet-400/80' },
  cyan:   { leftBorder: 'border-l-cyan-500/50',   iconWrap: 'bg-cyan-500/10 border-cyan-500/20',   iconText: 'text-cyan-400',   tag: 'border-cyan-500/25 text-cyan-400/80' },
  rose:   { leftBorder: 'border-l-rose-500/50',   iconWrap: 'bg-rose-500/10 border-rose-500/20',   iconText: 'text-rose-400',   tag: 'border-rose-500/25 text-rose-400/80' },
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
    <div className={`h-full bg-[#1E293B] border border-slate-700/50 border-l-4 ${a.leftBorder} rounded-lg p-6 flex flex-col gap-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-600/70 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]`}>
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-md border flex items-center justify-center ${a.iconWrap} ${a.iconText}`}>
          {icon}
        </div>
        <span className={`text-[10px] font-mono border px-2 py-0.5 rounded-sm ${a.tag}`}>
          [{idx}]
        </span>
      </div>
      <div className="flex-1">
        <h3 className="text-slate-100 font-semibold mb-2">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
      </div>
      {extra && <div className="mt-auto pt-2">{extra}</div>}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className={`${spaceGrotesk.className} ${jetbrainsMono.variable} min-h-screen bg-[#0F172A] text-slate-100`}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Dot grid */}
        <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid" />
        {/* Bottom fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
          style={{ background: 'linear-gradient(to bottom, transparent, #0F172A)' }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 border border-green-500/30 bg-green-500/5 text-green-400 text-xs font-mono px-3 py-1.5 rounded-sm mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {'// AI-POWERED MOCK INTERVIEWS'}
              </div>

              <h1 className="text-5xl xl:text-6xl font-bold text-slate-50 leading-tight tracking-tight mb-6">
                Interview practice<br />
                built for{' '}
                <span className="text-amber-400">engineers</span>
                <br />
                <span className="text-blue-400">who ship.</span>
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
                Practice with an AI interviewer that asks follow-up questions, adapts to your answers, and gives you honest feedback — not just a pass or fail. No payment required.
              </p>

              <div className="flex">
                <Link
                  href="/problems"
                  className="btn-glow-green inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-[#0F172A] font-bold px-10 py-4 rounded-lg text-lg cursor-pointer"
                >
                  Start Practicing
                  <IconArrow />
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-10 mt-12 pt-10 border-t border-slate-800">
                {[['20+', 'problems'], ['3', 'difficulty_levels'], ['45m', 'timed_sessions']].map(([val, label]) => (
                  <div key={label}>
                    <div className="text-2xl font-bold text-slate-50 font-mono">{val}</div>
                    <div className="text-slate-600 text-xs mt-0.5 font-mono">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — preview */}
            <InterviewPreview />
          </div>
        </div>
      </section>

      {/* ── VS COMPARISON ─────────────────────────────────────────────────── */}
      <section className="border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <AnimateIn className="mb-12">
            <SectionLabel index="001" label="Why MockPrep" />
            <h2 className="text-3xl font-bold text-slate-50 mb-3">The gap between practice and performance</h2>
            <p className="text-slate-500 text-lg max-w-xl">
              Solving problems alone doesn&rsquo;t prepare you for the real pressure of a technical interview. MockPrep closes that gap.
            </p>
          </AnimateIn>

          <AnimateIn delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-2 border border-slate-700/50 rounded-lg overflow-hidden">
              {/* Left — traditional */}
              <div className="border-b md:border-b-0 md:border-r border-slate-700/50">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-700/50 bg-slate-900/40">
                  <span className="text-red-400/60 text-xs font-mono">---</span>
                  <span className="text-slate-500 text-xs font-mono">traditional_practice.md</span>
                </div>
                <ul className="p-6 space-y-3.5">
                  {[
                    'Solve problems in silence with no one to talk to',
                    'No feedback until you look up the answer',
                    'Pass/fail verdict with no explanation',
                    'Never tested on communication',
                    "Doesn't replicate real interview pressure",
                  ].map((text) => (
                    <li key={text} className="flex items-start gap-3 text-sm">
                      <span className="text-red-400/60 shrink-0 mt-0.5 font-mono select-none">-</span>
                      <span className="text-slate-500">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — MockPrep */}
              <div>
                <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-700/50 bg-slate-900/40">
                  <span className="text-green-400/60 text-xs font-mono">+++</span>
                  <span className="text-green-400/70 text-xs font-mono">mock_prep.md</span>
                </div>
                <ul className="p-6 space-y-3.5">
                  {[
                    'AI interviewer that asks follow-up questions in real time',
                    "Socratic hints when you're stuck, not just the answer",
                    'Scored feedback on communication, logic, and code quality',
                    'Replicates the pressure of a real 45-minute technical round',
                    'Session history so you can track improvement over time',
                  ].map((text) => (
                    <li key={text} className="flex items-start gap-3 text-sm">
                      <span className="text-green-400/60 shrink-0 mt-0.5 font-mono select-none">+</span>
                      <span className="text-slate-200">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <AnimateIn className="mb-12">
            <SectionLabel index="002" label="Features" />
            <h2 className="text-3xl font-bold text-slate-50 mb-3">Built around real interview mechanics</h2>
            <p className="text-slate-500 text-lg max-w-xl">
              Every feature exists because real technical interviews demand it.
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
                  description="Back-and-forth conversation. The AI probes your reasoning, challenges assumptions, and guides you with hints — just like a human interviewer in a real loop."
                  extra={
                    <div className="flex gap-2 flex-wrap">
                      {['socratic_method', 'follow_ups', 'adaptive_hints'].map(tag => (
                        <span key={tag} className="text-[11px] font-mono border border-blue-500/20 text-blue-400/70 px-2 py-0.5 rounded-sm">{tag}</span>
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
                  title="20 Curated Problems"
                  description="Easy, medium, and hard problems spanning Arrays, Trees, Dynamic Programming, Graphs, and more — covering the topics that show up most in real interviews."
                  extra={
                    <div className="flex gap-2">
                      {[
                        { label: 'Easy', cls: 'border-green-500/25 text-green-400/80' },
                        { label: 'Medium', cls: 'border-amber-500/25 text-amber-400/80' },
                        { label: 'Hard', cls: 'border-red-500/25 text-red-400/80' },
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
                      <div className="h-1 flex-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full w-[58%] bg-amber-500/50 rounded-full" />
                      </div>
                      <span className="text-slate-600 text-[11px] font-mono shrink-0">26:14 / 45:00</span>
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

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="border-t border-slate-800/60 bg-[#1E293B]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <AnimateIn className="mb-12">
            <SectionLabel index="003" label="Workflow" />
            <h2 className="text-3xl font-bold text-slate-50">How it works</h2>
          </AnimateIn>

          <AnimateIn delay={100}>
            <div className="border border-slate-700/50 rounded-lg overflow-hidden">
              {[
                {
                  step: '01',
                  cmd: '--pick-problem',
                  title: 'Pick a problem',
                  desc: 'Filter by difficulty or category and choose a problem that matches where you want to focus.',
                },
                {
                  step: '02',
                  cmd: '--start-interview',
                  title: 'Interview live',
                  desc: 'Walk the AI through your thinking out loud, write your solution in the editor, and respond to follow-up questions in real time.',
                },
                {
                  step: '03',
                  cmd: '--view-report',
                  title: 'Get your report',
                  desc: 'Receive a scored breakdown of your performance with specific, actionable improvements to work on next session.',
                },
              ].map(({ step, cmd, title, desc }, i) => (
                <div
                  key={step}
                  className={`flex items-start gap-8 px-8 py-10 bg-[#1E293B] ${i > 0 ? 'border-t border-slate-700/50' : ''}`}
                >
                  <div className="shrink-0 w-10 text-center">
                    <div className="text-[10px] text-slate-600 font-mono mb-1">step</div>
                    <div className="text-3xl font-bold text-slate-700/80 font-mono leading-none">{step}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-green-400/50 font-mono mb-2">$ mockprep {cmd}</div>
                    <h3 className="text-slate-100 font-semibold text-lg mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-800/60">
        <AnimateIn>
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <div className="text-xs font-mono text-slate-600 mb-3">{'// ready when you are'}</div>
              <h2 className="text-4xl font-extrabold text-slate-50 mb-3">
                Find out where you stand.
              </h2>
              <p className="text-slate-500 text-lg max-w-lg">
                Pick a problem and start your first session right now.
              </p>
            </div>
            <Link
              href="/problems"
              className="btn-glow-green shrink-0 inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-[#0F172A] font-bold px-8 py-4 rounded-lg text-base cursor-pointer"
            >
              Start Practicing
              <IconArrow />
            </Link>
          </div>
        </AnimateIn>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-slate-600 text-sm font-mono font-semibold">MockPrep</span>
          <div className="flex items-center gap-6 text-sm font-mono">
            <Link href="/problems" className="text-slate-600 hover:text-slate-400 transition-colors">problems</Link>
            <Link href="/history" className="text-slate-600 hover:text-slate-400 transition-colors">history</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
