'use client';

import { useEffect, useState } from 'react';

type Accent = 'blue' | 'green' | 'amber' | 'violet' | 'cyan';

const accents: Record<
  Accent,
  { iconWrap: string; iconText: string; dot: string; label: string; glow: string }
> = {
  blue: {
    iconWrap: 'bg-blue-500/10 border-blue-500/20',
    iconText: 'text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-500 dark:bg-blue-400',
    label: 'border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10',
    glow: 'rgba(59,130,246,0.45)',
  },
  green: {
    iconWrap: 'bg-green-500/10 border-green-500/20',
    iconText: 'text-green-600 dark:text-green-400',
    dot: 'bg-green-500 dark:bg-green-400',
    label: 'border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/10',
    glow: 'rgba(34,197,94,0.45)',
  },
  amber: {
    iconWrap: 'bg-amber-500/10 border-amber-500/20',
    iconText: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500 dark:bg-amber-400',
    label: 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10',
    glow: 'rgba(251,191,36,0.45)',
  },
  violet: {
    iconWrap: 'bg-violet-500/10 border-violet-500/20',
    iconText: 'text-violet-600 dark:text-violet-400',
    dot: 'bg-violet-500 dark:bg-violet-400',
    label: 'border-violet-500/30 text-violet-600 dark:text-violet-400 bg-violet-500/10',
    glow: 'rgba(139,92,246,0.45)',
  },
  cyan: {
    iconWrap: 'bg-cyan-500/10 border-cyan-500/20',
    iconText: 'text-cyan-600 dark:text-cyan-400',
    dot: 'bg-cyan-500 dark:bg-cyan-400',
    label: 'border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10',
    glow: 'rgba(6,182,212,0.45)',
  },
};

export type ShowcaseItem = {
  icon: React.ReactNode;
  title: string;
  accent: Accent;
  filename: string;
  demo: React.ReactNode;
};

export default function HeroShowcase({ items }: { items: ShowcaseItem[] }) {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const current = items[active];
  const a = accents[current.accent];

  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(id);
  }, [autoplay, items.length]);

  const handleSelect = (i: number) => {
    setAutoplay(false);
    setActive(i);
  };

  return (
    <div className="relative w-full">
      {/* Ambient glow follows the active tab */}
      <div
        aria-hidden
        className="absolute -inset-6 rounded-2xl blur-3xl opacity-20 pointer-events-none transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${a.glow} 0%, transparent 70%)` }}
      />

      {/* Window */}
      <div className="relative bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700/50 rounded-lg overflow-hidden shadow-xl dark:shadow-2xl">

        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-700/50 bg-slate-100 dark:bg-[#0e0e0f]/80">
          <div className="flex gap-1.5 items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-slate-400 dark:text-slate-500 text-xs font-mono truncate">{current.filename}</span>
            <span className={`flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-sm border shrink-0 ${a.label}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${a.dot}`} />
              LIVE
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-700/40 shrink-0 tracking-wider">PREVIEW</span>
        </div>

        {/* Body: vertical tab rail + content */}
        <div className="flex min-h-[520px]">
          {/* Tab rail */}
          <div className="flex flex-col gap-2 p-3 border-r border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-[#0e0e0f]/40">
            {items.map((it, i) => {
              const ac = accents[it.accent];
              const isActive = active === i;
              return (
                <button
                  key={it.title}
                  type="button"
                  onClick={() => handleSelect(i)}
                  aria-label={it.title}
                  aria-pressed={isActive}
                  title={it.title}
                  className={`relative w-11 h-11 rounded-md border flex items-center justify-center transition-colors duration-150 ${
                    isActive
                      ? `${ac.iconWrap} ${ac.iconText}`
                      : 'bg-transparent border-transparent text-slate-400 dark:text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-700/40 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {isActive && (
                    <span className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[calc(0.75rem+1px)] w-0.5 h-6 rounded-full ${ac.dot}`} />
                  )}
                  {it.icon}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 p-5 min-w-0">
            <div key={active} className="fade-in">
              <div className="mb-4">
                <div className={`text-[10px] font-mono mb-1 ${a.iconText}`}>
                  {'// ' + String(active + 1).padStart(2, '0') + ' / ' + (items.length).toString().padStart(2, '0')}
                </div>
                <h3 className="text-slate-800 dark:text-slate-100 font-semibold text-base">{current.title}</h3>
              </div>

              <div>{current.demo}</div>
            </div>
          </div>
        </div>

        {/* Footer status / preview hint */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700/50 bg-slate-100 dark:bg-[#0e0e0f]/70 px-4 py-2">
          <span className="text-slate-500 dark:text-slate-400 text-[10px] font-mono flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${autoplay ? 'animate-pulse' : ''} ${a.dot}`} />
            {autoplay ? 'auto-cycling — click any tab to explore' : 'click any tab to preview that feature'}
          </span>
          <span className="text-slate-400 dark:text-slate-600 text-[10px] font-mono tabular-nums shrink-0">
            {String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}
