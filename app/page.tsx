import Link from 'next/link';

// ── Inline SVG icons ─────────────────────────────────────────────────────────

function IconChat() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconBarChart() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── Subcomponents ─────────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
      <div className="w-11 h-11 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400">
        {icon}
      </div>
      <div>
        <h3 className="text-white font-semibold text-lg mb-1.5">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-4">
      <span className="text-3xl font-bold text-white mb-1">{value}</span>
      <span className="text-gray-500 text-sm">{label}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* subtle radial glow behind the headline */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex justify-center"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.18) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/25 text-blue-400 text-xs font-medium px-3.5 py-1.5 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
            AI-Powered Mock Interviews
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Start interviewing
            <br />
            <span
              style={{
                background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              with confidence.
            </span>
          </h1>

          <p className="text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Practice with an AI interviewer that talks back, adapts to your answers,
            and gives you the honest feedback that LeetCode never will.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/problems"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
            >
              Browse Problems
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link
              href="/history"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-medium px-8 py-3.5 rounded-xl text-base transition-colors"
            >
              View History
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section className="border-y border-gray-800">
        <div className="max-w-3xl mx-auto px-6 flex flex-wrap justify-center divide-x divide-gray-800">
          <StatPill value="20" label="Practice Problems" />
          <StatPill value="4" label="Languages" />
          <StatPill value="8" label="Problem Categories" />
          <StatPill value="45m" label="Timed Sessions" />
        </div>
      </section>

      {/* ── WHY MOCKPREP ──────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">
            Not just another practice tool
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            There&rsquo;s a gap between solving problems alone and performing in a real
            interview. MockPrep closes it.
          </p>
        </div>

        {/* Comparison table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Traditional */}
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-4">
              Traditional Practice
            </p>
            <ul className="space-y-3">
              {[
                'Solve problems in silence — no one to talk to',
                'No feedback until you look up the answer',
                'Pass/fail verdict with no explanation',
                'Never tested on communication or clarity',
                'Doesn\'t replicate interview pressure',
              ].map((text) => (
                <li key={text} className="flex items-start gap-2.5 text-gray-500 text-sm">
                  <span className="text-red-500 mt-0.5"><IconX /></span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          {/* MockPrep */}
          <div className="bg-gray-900 border border-blue-500/30 rounded-2xl p-6 shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)]">
            <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4">
              MockPrep
            </p>
            <ul className="space-y-3">
              {[
                'An AI interviewer that asks follow-up questions in real time',
                'Socratic hints when you\'re stuck — not just the answer',
                'Scored feedback across communication, problem-solving, and code quality',
                'Replicate the pressure and pacing of a real 45-minute technical round',
                'Session history so you can track improvement over time',
              ].map((text) => (
                <li key={text} className="flex items-start gap-2.5 text-gray-100 text-sm">
                  <span className="text-blue-400 mt-0.5"><IconCheck /></span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">Everything you need to prepare</h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Built around the way real technical interviews actually work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard
            icon={<IconChat />}
            title="Live AI Interviewer"
            description="Have a real back-and-forth conversation. The AI probes your reasoning, challenges your assumptions, and guides you with hints — just like a human interviewer would."
          />
          <FeatureCard
            icon={<IconBarChart />}
            title="Honest Scored Feedback"
            description="Every session ends with a detailed report scoring your communication, problem-solving approach, and code quality on a 1–10 scale with written explanations."
          />
          <FeatureCard
            icon={<IconClock />}
            title="Timed 45-Minute Sessions"
            description="Practice under the same time constraints as a real interview. A live countdown keeps you on pace and your time management is reflected in your final score."
          />
          <FeatureCard
            icon={<IconCode />}
            title="Full Code Editor"
            description="Write real code in Python, JavaScript, Java, or C++ inside a Monaco editor with syntax highlighting, autocompletion, and a resizable split-pane layout."
          />
          <FeatureCard
            icon={<IconLayers />}
            title="20 Curated Problems"
            description="7 easy, 8 medium, and 5 hard problems spanning Arrays, Strings, Trees, Dynamic Programming, Graphs, and more — covering the topics that show up most in real interviews."
          />
          <FeatureCard
            icon={<IconBarChart />}
            title="Session History"
            description="Every completed session is saved locally so you can review your scores, re-read feedback, and see exactly where you've improved over time."
          />
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="border-t border-gray-800 bg-gray-900/40">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">How it works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Pick a problem',
                desc: 'Filter by difficulty or category and choose a problem that matches where you want to focus.',
              },
              {
                step: '02',
                title: 'Interview live',
                desc: 'Walk the AI through your thinking out loud, write your solution in the editor, and respond to follow-up questions.',
              },
              {
                step: '03',
                title: 'Get your report',
                desc: 'Receive a scored breakdown of your performance with specific, actionable improvements to work on.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="text-4xl font-black text-blue-600/30 mb-3 leading-none">{step}</div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4">
          Ready to find out where you stand?
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-lg mx-auto">
          No sign-up. No setup. Pick a problem and start your first session right now.
        </p>
        <Link
          href="/problems"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-colors"
        >
          Start Practicing
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-800 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
