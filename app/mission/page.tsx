import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mission — MockPrep',
  description: 'Why MockPrep exists, and what we think modern interview preparation should look like.',
};

export default function MissionPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* ── Header ── */}
      <div className="relative dot-grid border-b border-slate-200 dark:border-slate-800 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 50% -20%, rgba(59,130,246,0.07) 0%, transparent 65%)' }}
        />
        <div className="relative max-w-2xl mx-auto px-6 lg:px-8 pt-12 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-slate-500 dark:text-slate-600 tracking-widest">{'// MISSION'}</span>
            <div className="h-px w-10 bg-slate-300 dark:bg-slate-700" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">The Idea</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Why this exists, and what we think it should do.
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-2xl mx-auto px-6 lg:px-8 py-16">
        <div className="space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed text-[17px]">

          <p>
            Most interview preparation tools were built for a version of software engineering that is
            becoming less and less complete. They are genuinely valuable, and the fundamentals they test
            still matter, but they were designed before AI became a daily part of the job for most
            engineers. MockPrep started as an attempt to close that gap.
          </p>

          <div className="border-l-2 border-blue-500/50 pl-5 py-1">
            <p className="text-slate-600 dark:text-slate-400 italic">
              The interview has not kept up with the job. That is the whole problem.
            </p>
          </div>

          <p>
            That said, traditional coding problems are not dead. Data structures, algorithms,
            complexity tradeoffs. The ability to think clearly through a hard problem, explain your
            reasoning out loud, and handle edge cases under time pressure is still a real signal.
            It still reflects how someone thinks. That is why coding problems remain a core part of
            MockPrep, and why the AI interviewer pushes back, asks follow-up questions, and does not
            just accept your first answer.
          </p>

          <p>
            But there is a second dimension to modern software engineering that almost no interview
            platform actually tests: how well you work with AI tools. Not just whether you know how
            to open a chat window. That bar is too low. We mean something more specific. Do you
            know how to prompt clearly enough to get useful output? Do you validate what the model
            gives you, or do you ship it? Can you spot when the AI missed an edge case? Can you
            iterate toward a correct solution when the first attempt is wrong? That kind of judgment,
            what we are calling GenAI fluency, is increasingly what separates engineers who thrive
            in this environment from those who struggle.
          </p>

          <p>
            The GenAI fluency problems on this platform are designed specifically around that idea.
            Each one is a scenario where an AI will produce something plausible but incomplete.
            The goal is not to test whether you can use AI. It is to test whether you can
            direct it, question it, and build something reliable on top of it.
          </p>

          <p>
            MockPrep is not a finished product. It is an honest attempt to build something that
            reflects what the job actually looks like right now, not what it looked like five years
            ago. We are still figuring out what that means. But that is the goal.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 pt-2">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span className="font-mono text-xs text-slate-400 dark:text-slate-600">eof</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Back to home */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to home
            </Link>
            <span className="hidden sm:block text-slate-300 dark:text-slate-700">·</span>
            <Link
              href="/problems"
              className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors font-medium group"
            >
              Start practicing
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
