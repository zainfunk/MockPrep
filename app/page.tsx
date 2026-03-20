import Link from 'next/link';
import AnimateIn from '@/components/AnimateIn';

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

function IconCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── Mock interview preview UI ──────────────────────────────────────────────────

function InterviewPreview() {
  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
      {/* Glow behind card */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl blur-2xl"
        style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(59,130,246,0.18) 0%, transparent 70%)' }}
      />
      {/* Card */}
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-950/60">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-gray-700" />
          </div>
          <span className="text-gray-500 text-xs ml-2">Two Sum · Easy · 38:14 remaining</span>
        </div>

        {/* Chat messages */}
        <div className="p-4 space-y-4 text-sm">
          {/* AI message */}
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-blue-400 text-xs font-bold">AI</span>
            </div>
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl rounded-tl-sm px-3.5 py-2.5 text-gray-300 leading-relaxed max-w-xs">
              Good start. Before writing code, what data structure are you thinking of using, and why?
            </div>
          </div>

          {/* User message */}
          <div className="flex gap-3 justify-end">
            <div className="bg-blue-600/20 border border-blue-500/25 rounded-xl rounded-tr-sm px-3.5 py-2.5 text-gray-200 leading-relaxed max-w-xs">
              I&apos;d use a hash map to store each number and its index as I iterate.
            </div>
            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-gray-300 text-xs font-bold">U</span>
            </div>
          </div>

          {/* AI follow-up */}
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-blue-400 text-xs font-bold">AI</span>
            </div>
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl rounded-tl-sm px-3.5 py-2.5 text-gray-300 leading-relaxed max-w-xs">
              Correct. What&apos;s the time and space complexity of that approach?
            </div>
          </div>

          {/* Typing indicator */}
          <div className="flex gap-3 justify-end items-end">
            <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl rounded-tr-sm px-4 py-3">
              <div className="flex gap-1 items-center h-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
              <span className="text-gray-300 text-xs font-bold">U</span>
            </div>
          </div>
        </div>

        {/* Score strip at bottom */}
        <div className="border-t border-gray-800 px-4 py-3 bg-gray-950/40 flex items-center justify-between">
          <span className="text-gray-500 text-xs">Session score</span>
          <div className="flex gap-3">
            {[['Comm', '8'], ['Logic', '7'], ['Code', '9']].map(([label, val]) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-white text-sm font-bold">{val}<span className="text-gray-600 text-xs">/10</span></span>
                <span className="text-gray-600 text-[10px]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Feature card ──────────────────────────────────────────────────────────────

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-900/50 border border-gray-800 hover:border-gray-600 rounded-2xl p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)]">
      <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
        {icon}
      </div>
      <h3 className="text-white font-semibold">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Top radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 55% at 50% -5%, rgba(59,130,246,0.14) 0%, transparent 65%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left - text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-3.5 py-1.5 rounded-full mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                AI-Powered Mock Interviews
              </div>

              <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
                Interview prep that
                <br />
                <span style={{
                  background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  talks back.
                </span>
              </h1>

              <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
                Practice with an AI interviewer that asks follow-up questions, adapts to your answers, and gives you honest feedback, not just a pass or fail.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/problems"
                  className="btn-glow inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl"
                >
                  Start Practicing
                  <IconArrow />
                </Link>
                <Link
                  href="/history"
                  className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 font-medium px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  View History
                </Link>
              </div>

              {/* Inline stats */}
              <div className="flex gap-8 mt-12 pt-10 border-t border-gray-800">
                {[['20+', 'Problems'], ['3', 'Difficulty levels'], ['45m', 'Timed sessions']].map(([val, label]) => (
                  <div key={label}>
                    <div className="text-2xl font-bold text-white">{val}</div>
                    <div className="text-gray-500 text-sm mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - preview */}
            <InterviewPreview />
          </div>
        </div>
      </section>

      {/* ── VS COMPARISON ─────────────────────────────────────────────────── */}
      <section className="border-t border-gray-800/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <AnimateIn className="mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Not just another practice tool</h2>
            <p className="text-gray-400 text-lg max-w-xl">
              There&rsquo;s a gap between solving problems alone and performing in a real interview. MockPrep closes it.
            </p>
          </AnimateIn>

          <AnimateIn delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-7">
              <p className="text-gray-600 text-xs font-semibold uppercase tracking-widest mb-5">Traditional Practice</p>
              <ul className="space-y-3.5">
                {[
                  'Solve problems in silence with no one to talk to',
                  'No feedback until you look up the answer',
                  'Pass/fail verdict with no explanation',
                  'Never tested on communication',
                  'Doesn\'t replicate real interview pressure',
                ].map((text) => (
                  <li key={text} className="flex items-start gap-2.5 text-gray-500 text-sm">
                    <span className="text-red-500/70 mt-0.5"><IconX /></span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900 border border-blue-500/25 rounded-2xl p-7 shadow-[0_0_40px_-8px_rgba(59,130,246,0.12)]">
              <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-5">MockPrep</p>
              <ul className="space-y-3.5">
                {[
                  'AI interviewer that asks follow-up questions in real time',
                  'Socratic hints when you\'re stuck, not just the answer',
                  'Scored feedback on communication, logic, and code quality',
                  'Replicates the pressure of a real 45-minute technical round',
                  'Session history so you can track improvement over time',
                ].map((text) => (
                  <li key={text} className="flex items-start gap-2.5 text-gray-200 text-sm">
                    <span className="text-blue-400 mt-0.5"><IconCheck /></span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-800/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <AnimateIn className="mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Everything you need to prepare</h2>
            <p className="text-gray-400 text-lg max-w-xl">
              Built around the way real technical interviews actually work.
            </p>
          </AnimateIn>

          <AnimateIn delay={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureCard icon={<IconChat />} title="Live AI Interviewer" description="Back-and-forth conversation. The AI probes your reasoning, challenges assumptions, and guides you with hints, just like a human interviewer." />
              <FeatureCard icon={<IconBarChart />} title="Honest Scored Feedback" description="Every session ends with a detailed report scoring communication, problem-solving, and code quality on a 1–10 scale with written explanations." />
              <FeatureCard icon={<IconClock />} title="Timed 45-Minute Sessions" description="Practice under real interview time constraints. A live countdown keeps you on pace and your time management is reflected in your final score." />
              <FeatureCard icon={<IconCode />} title="Full Code Editor" description="Write real code in Python, JavaScript, Java, or C++ inside a Monaco editor with syntax highlighting and a resizable split-pane layout." />
              <FeatureCard icon={<IconLayers />} title="20 Curated Problems" description="Easy, medium, and hard problems spanning Arrays, Trees, Dynamic Programming, Graphs, and more. Covers the topics that show up most in real interviews." />
              <FeatureCard icon={<IconBarChart />} title="Session History" description="Every completed session is saved so you can review scores, re-read feedback, and see exactly where you've improved over time." />
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="border-t border-gray-800/60 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <AnimateIn>
            <h2 className="text-3xl font-bold text-white mb-14">How it works</h2>
          </AnimateIn>

          <AnimateIn delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-800/60 rounded-2xl overflow-hidden">
            {[
              { step: '01', title: 'Pick a problem', desc: 'Filter by difficulty or category and choose a problem that matches where you want to focus.' },
              { step: '02', title: 'Interview live', desc: 'Walk the AI through your thinking out loud, write your solution in the editor, and respond to follow-up questions.' },
              { step: '03', title: 'Get your report', desc: 'Receive a scored breakdown of your performance with specific, actionable improvements to work on.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-gray-950 px-8 py-10">
                <div className="text-5xl font-black text-blue-600/20 mb-5 leading-none">{step}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-800/60">
        <AnimateIn>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <h2 className="text-4xl font-extrabold text-white mb-3">
              Ready to find out where you stand?
            </h2>
            <p className="text-gray-400 text-lg max-w-lg">
              Pick a problem and start your first session right now.
            </p>
          </div>
          <Link
            href="/problems"
            className="btn-glow shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl text-base"
          >
            Start Practicing
            <IconArrow />
          </Link>
        </div>
        </AnimateIn>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-gray-600 text-sm font-semibold">MockPrep</span>
          <div className="flex items-center gap-6 text-gray-600 text-sm">
            <Link href="/problems" className="hover:text-gray-400 transition-colors">Problems</Link>
            <Link href="/history" className="hover:text-gray-400 transition-colors">History</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
