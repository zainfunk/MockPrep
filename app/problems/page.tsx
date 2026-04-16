'use client';

import { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { problems } from '@/lib/problems';
import type { Difficulty } from '@/lib/problems';
import { genaiProblems } from '@/lib/genaiProblems';
import { FLUENCY_CATEGORIES } from '@/data/genaiFluentQuestions';
import InterviewStartModal, { type ModalProblem } from '@/components/InterviewStartModal';

// ── Popularity order (lower = shown first when no filter active) ──────────────
// Ranked by real-world interview frequency / cultural prominence

const POPULARITY_ORDER: Record<string, number> = {
  'two-sum': 1,
  'valid-parentheses': 2,
  'number-of-islands': 3,       // medium
  'maximum-subarray': 4,
  'best-time-to-buy-sell-stock': 5,
  'coin-change': 6,             // medium
  'reverse-linked-list': 7,
  'lru-cache': 8,               // hard
  'climbing-stairs': 9,
  'contains-duplicate': 10,
  'merge-two-sorted-lists': 11,
  'valid-anagram': 12,
  'linked-list-cycle': 13,
  'binary-search': 14,
  'invert-binary-tree': 15,
  'single-number': 16,
  'longest-substring': 17,
  'group-anagrams': 18,
  'binary-tree-level-order-traversal': 19,
  'merge-intervals': 20,
  'product-of-array-except-self': 21,
  '3sum': 22,
  'top-k-frequent-elements': 23,
  'kth-largest-element': 24,
  'course-schedule': 25,
  'house-robber': 26,
  'majority-element': 27,
  'fizz-buzz': 28,
  'palindrome-number': 29,
  'missing-number': 30,
  'word-break': 31,
  'longest-consecutive-sequence': 32,
  'subsets': 33,
  'combination-sum': 34,
  'permutations': 35,
  'container-with-most-water': 36,
  'diameter-of-binary-tree': 37,
  'validate-bst': 38,
  'lowest-common-ancestor': 39,
  'binary-tree-right-side-view': 40,
  'move-zeroes': 41,
  'remove-duplicates-sorted-array': 42,
  'find-all-anagrams': 43,
  'jump-game': 44,
  'unique-paths': 45,
  'decode-ways': 46,
  'maximum-product-subarray': 47,
  'longest-palindromic-substring': 48,
  'longest-increasing-subsequence': 49,
  'word-search': 50,
  'trapping-rain-water': 51,
  'merge-k-sorted-lists': 52,
  'minimum-window-substring': 53,
  'edit-distance': 54,
  'search-rotated-sorted-array': 55,
  'find-minimum-rotated-sorted-array': 56,
  'spiral-matrix': 57,
  'rotate-image': 58,
  'letter-combinations': 59,
  'pacific-atlantic-water-flow': 60,
  'course-schedule-ii': 61,
  'word-search-ii': 62,
  'sliding-window-maximum': 63,
  'regular-expression-matching': 64,
  'n-queens': 65,
  'word-ladder': 66,
  'serialize-deserialize-bt': 67,
  'median-of-two-sorted-arrays': 68,
};

// ── Difficulty score maps ─────────────────────────────────────────────────────

const GENAI_DIFFICULTY_SCORE: Record<string, number> = {
  // existing
  'find-duplicates-ai': 28,
  'csv-report-ai': 38,
  'text-chunker-ai': 44,
  'json-flattener-ai': 52,
  'lru-cache-ai': 65,
  'trie-autocomplete-ai': 72,
  'log-analyzer-ai': 78,
  'session-analyzer-ai': 83,
  'rate-limiter-ai': 87,
  'expression-evaluator-ai': 93,
  // easy
  'palindrome-checker-ai': 10,
  'moving-average-ai': 15,
  'word-frequency-ai': 20,
  'number-formatter-ai': 25,
  // medium
  'balanced-brackets-ai': 30,
  'markdown-parser-ai': 36,
  'stock-profit-ai': 42,
  'url-shortener-ai': 46,
  'dependency-resolver-ai': 50,
  'time-zone-converter-ai': 54,
  'matrix-spiral-ai': 57,
  'config-validator-ai': 59,
  'token-bucket-ai': 61,
  'stream-stats-ai': 62,
  // hard
  'graph-shortest-path-ai': 67,
  'bloom-filter-ai': 71,
  'event-sourcing-ai': 74,
  'parser-combinator-ai': 77,
  'cache-with-ttl-ai': 80,
  'pipeline-builder-ai': 84,
  'circuit-breaker-ai': 86,
  'semantic-cache-ai': 89,
  'query-engine-ai': 91,
  'consistent-hashing-ai': 92,
};

const DIFFICULTY_SCORE: Record<string, number> = {
  'contains-duplicate': 10, 'palindrome-number': 12, 'valid-anagram': 14,
  'two-sum': 16, 'best-time-to-buy-sell-stock': 20, 'valid-parentheses': 24,
  'maximum-subarray': 27, 'reverse-linked-list': 29, 'merge-two-sorted-lists': 32,
  'letter-combinations': 35, 'house-robber': 40, 'longest-substring': 42,
  'binary-tree-level-order-traversal': 45, 'word-break': 46,
  'container-with-most-water': 48, 'group-anagrams': 49,
  'product-of-array-except-self': 51, 'merge-intervals': 53,
  '3sum': 54, 'number-of-islands': 56, 'coin-change': 57,
  'longest-palindromic-substring': 60, 'word-search': 63,
  'merge-k-sorted-lists': 70, 'lru-cache': 75, 'trapping-rain-water': 77,
  'serialize-deserialize-bt': 80, 'word-ladder': 82,
  'n-queens': 88, 'median-of-two-sorted-arrays': 95,
};

// ── Design tokens ─────────────────────────────────────────────────────────────

const D = {
  easy: {
    topBorder: 'border-t-4 border-[#58e7ab]',
    badge: 'bg-[#69f6b8]/10 text-[#58e7ab]',
    bar: '#58e7ab',
    diffBtn: 'bg-[#69f6b8]/10 text-[#58e7ab] border border-[#69f6b8]/20',
  },
  medium: {
    topBorder: 'border-t-4 border-amber-400',
    badge: 'bg-amber-400/10 text-amber-400',
    bar: '#fbbf24',
    diffBtn: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
  },
  hard: {
    topBorder: 'border-t-4 border-[#d7383b]',
    badge: 'bg-[#9f0519]/10 text-[#d7383b]',
    bar: '#d7383b',
    diffBtn: 'bg-[#9f0519]/10 text-[#d7383b] border border-[#9f0519]/20',
  },
};

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconChevron() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function IconFilter() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

function IconAnalytics() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="8" strokeWidth="3" strokeLinecap="round" />
      <line x1="12" y1="12" x2="12" y2="16" />
    </svg>
  );
}

// ── Inner page ────────────────────────────────────────────────────────────────

function ProblemsPageInner() {
  const searchParams = useSearchParams();
  const rawTab = searchParams.get('tab');
  const initialTab = rawTab === 'genai' ? 'genai' : rawTab === 'fluency' ? 'fluency' : 'coding';

  const [activeTab, setActiveTab]             = useState<'coding' | 'genai' | 'fluency'>(initialTab);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'' | Difficulty>('');
  const [selectedCategory, setSelectedCategory]     = useState('');
  const [selectedCompany, setSelectedCompany]       = useState('');
  const [showCompanyTags, setShowCompanyTags]       = useState(false);
  const [genaiDifficulty, setGenaiDifficulty]       = useState<'' | Difficulty>('');
  const [genaiCategory, setGenaiCategory]           = useState('');
  const [modalProblem, setModalProblem]             = useState<ModalProblem | null>(null);
  const [showBackToTop, setShowBackToTop]           = useState(false);
  const [mounted, setMounted]                       = useState(false);
  const headerRef                                   = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    const header = headerRef.current;
    if (!header) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowBackToTop(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const categories = useMemo(() => Array.from(new Set(problems.map((p) => p.category))).sort(), []);
  const companies  = useMemo(() => Array.from(new Set(problems.flatMap((p) => p.companies ?? []))).sort(), []);
  const genaiCategories = useMemo(() => Array.from(new Set(genaiProblems.map((p) => p.category))).sort(), []);

  const filtered = useMemo(() => {
    const result = problems.filter((p) => {
      if (selectedDifficulty && p.difficulty !== selectedDifficulty) return false;
      if (selectedCategory   && p.category   !== selectedCategory)   return false;
      if (selectedCompany    && !p.companies?.includes(selectedCompany)) return false;
      return true;
    });
    // No active filter → sort by popularity. Filter active → keep popularity order within results.
    return result.sort(
      (a, b) => (POPULARITY_ORDER[a.id] ?? 999) - (POPULARITY_ORDER[b.id] ?? 999)
    );
  }, [selectedDifficulty, selectedCategory, selectedCompany]);

  const filteredGenai = useMemo(() => genaiProblems
    .filter((p) => {
      if (genaiDifficulty && p.difficulty !== genaiDifficulty) return false;
      if (genaiCategory   && p.category   !== genaiCategory)   return false;
      return true;
    })
    .sort((a, b) => ({ easy: 0, medium: 1, hard: 2 }[a.difficulty] - { easy: 0, medium: 1, hard: 2 }[b.difficulty])),
  [genaiDifficulty, genaiCategory]);

  const isCodingFiltered = selectedDifficulty || selectedCategory || selectedCompany;
  const isGenaiFiltered  = genaiDifficulty || genaiCategory;

  const clearCoding = () => { setSelectedDifficulty(''); setSelectedCategory(''); setSelectedCompany(''); };
  const clearGenai  = () => { setGenaiDifficulty(''); setGenaiCategory(''); };

  const activeProblems = activeTab === 'coding' ? filtered : filteredGenai;
  const totalActive    = activeTab === 'coding' ? problems.length : activeTab === 'genai' ? genaiProblems.length : 0;

  return (
    <>
    <main
      className="min-h-screen bg-[#0e0e0f] text-white"
      style={{
        backgroundImage: 'radial-gradient(circle, #262627 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* ── Sticky sub-header ── */}
      <header ref={headerRef} className="bg-[#0e0e0f] border-b border-white/5">
        <div className="w-full px-6 md:px-10 xl:px-16 pt-12 pb-6">

          {/* Title row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-5xl font-headline font-bold tracking-tighter mb-4 text-white">
                Problem Library
              </h1>
              {/* Tab switcher */}
              <div className="flex gap-1 p-1 bg-[#131314] rounded-lg w-fit">
                <button
                  onClick={() => setActiveTab('coding')}
                  className={`px-5 py-2 rounded-md text-sm font-headline font-bold transition-all cursor-pointer ${
                    activeTab === 'coding'
                      ? 'bg-[#1a191b] text-white shadow-sm'
                      : 'text-[#adaaab] hover:text-white'
                  }`}
                >
                  Coding Problems
                </button>
                <button
                  onClick={() => setActiveTab('genai')}
                  className={`px-5 py-2 rounded-md text-sm font-headline font-medium transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'genai'
                      ? 'bg-[#1a191b] text-white shadow-sm'
                      : 'text-[#adaaab] hover:text-white'
                  }`}
                >
                  GenAI Coding
                  <span className="bg-[#6e9fff]/20 text-[#85adff] px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest">
                    NEW
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('fluency')}
                  className={`px-5 py-2 rounded-md text-sm font-headline font-medium transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === 'fluency'
                      ? 'bg-[#1a191b] text-white shadow-sm'
                      : 'text-[#adaaab] hover:text-white'
                  }`}
                >
                  GenAI Fluency
                  <span className="bg-[#9bffce]/10 text-[#9bffce] px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest">
                    NEW
                  </span>
                </button>
              </div>
            </div>

            {/* Problem count badge */}
            {activeTab !== 'fluency' && (
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#adaaab] bg-[#131314] px-4 py-2 rounded-lg border border-white/5 w-fit">
                <IconAnalytics />
                Showing {activeProblems.length} of {totalActive} problems
              </div>
            )}
          </div>

          {/* ── Filter bar ── */}
          {activeTab === 'fluency' ? null : activeTab === 'coding' ? (
            <div className="flex flex-wrap items-center gap-3">
              {/* Difficulty pills */}
              <div className="flex bg-[#131314] rounded-lg p-1 gap-1">
                {(['', 'easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={`px-3 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                      selectedDifficulty === d
                        ? d === ''
                          ? 'bg-[#85adff]/10 text-[#85adff] border border-[#85adff]/20'
                          : D[d].diffBtn
                        : 'text-[#adaaab] hover:bg-[#1a191b] hover:text-white'
                    }`}
                  >
                    {d === '' ? 'ALL' : d.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="h-6 w-px bg-white/10 mx-1" />

              {/* Category select */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-[#1a191b] border border-white/10 text-[#adaaab] text-xs font-headline rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-[#85adff]/50 hover:border-white/20 transition-colors cursor-pointer"
                >
                  <option value="">Categories</option>
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#767576]">
                  <IconChevron />
                </span>
              </div>

              {/* Company select */}
              <div className="relative">
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  disabled={!showCompanyTags}
                  className={`appearance-none border text-xs font-headline rounded-lg pl-3 pr-8 py-2 focus:outline-none transition-colors ${
                    showCompanyTags
                      ? 'bg-[#1a191b] border-white/10 text-[#adaaab] hover:border-white/20 focus:border-[#85adff]/50 cursor-pointer'
                      : 'bg-[#131314] border-white/5 text-[#484849] cursor-not-allowed'
                  }`}
                >
                  <option value="">Company</option>
                  {companies.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#767576]">
                  <IconChevron />
                </span>
              </div>

              {/* Company toggle */}
              <button
                onClick={() => { setShowCompanyTags((v) => { if (v) setSelectedCompany(''); return !v; }); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-headline transition-all cursor-pointer ${
                  showCompanyTags
                    ? 'bg-[#85adff]/10 border-[#85adff]/30 text-[#85adff]'
                    : 'bg-[#1a191b] border-white/10 text-[#adaaab] hover:border-white/20 hover:text-white'
                }`}
              >
                <IconFilter />
                Companies
              </button>

              {/* Info tooltips */}
              <div className="group relative flex items-center gap-1.5 text-[#484849] hover:text-[#767576] transition-colors cursor-default">
                <IconInfo />
                <span className="text-[11px] font-mono hidden sm:block">Difficulty bars</span>
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-[#1a191b] border border-white/10 text-[#adaaab] text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 text-center leading-relaxed shadow-xl">
                  Bar length shows relative difficulty across the full problem set, not just within a tier.
                </div>
              </div>

              <div className="group relative flex items-center gap-1.5 text-[#484849] hover:text-[#767576] transition-colors cursor-default">
                <IconInfo />
                <span className="text-[11px] font-mono hidden sm:block">Company tags</span>
                <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-64 bg-[#1a191b] border border-white/10 text-[#adaaab] text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 text-center leading-relaxed shadow-xl">
                  Company tags are based on publicly reported interview experiences and do not imply affiliation or endorsement.
                </div>
              </div>

              {/* Reset */}
              {isCodingFiltered && (
                <button
                  onClick={clearCoding}
                  className="ml-auto flex items-center gap-1.5 text-xs font-mono text-[#85adff] hover:underline cursor-pointer"
                >
                  <IconRefresh />
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              {/* GenAI difficulty pills */}
              <div className="flex bg-[#131314] rounded-lg p-1 gap-1">
                {(['', 'easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setGenaiDifficulty(d)}
                    className={`px-3 py-1 text-xs font-mono rounded transition-colors cursor-pointer ${
                      genaiDifficulty === d
                        ? d === ''
                          ? 'bg-[#ac8aff]/10 text-[#ac8aff] border border-[#ac8aff]/20'
                          : D[d].diffBtn
                        : 'text-[#adaaab] hover:bg-[#1a191b] hover:text-white'
                    }`}
                  >
                    {d === '' ? 'ALL' : d.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="h-6 w-px bg-white/10 mx-1" />

              {/* GenAI category select */}
              <div className="relative">
                <select
                  value={genaiCategory}
                  onChange={(e) => setGenaiCategory(e.target.value)}
                  className="appearance-none bg-[#1a191b] border border-white/10 text-[#adaaab] text-xs font-headline rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-[#ac8aff]/50 hover:border-white/20 transition-colors cursor-pointer"
                >
                  <option value="">Categories</option>
                  {genaiCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#767576]">
                  <IconChevron />
                </span>
              </div>

              {/* Info tooltip */}
              <div className="group relative flex items-center gap-1.5 text-[#484849] hover:text-[#767576] transition-colors cursor-default">
                <IconInfo />
                <span className="text-[11px] font-mono hidden sm:block">Difficulty bars</span>
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-[#1a191b] border border-white/10 text-[#adaaab] text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 text-center leading-relaxed shadow-xl">
                  Bar length shows relative difficulty across the full problem set, not just within a tier.
                </div>
              </div>

              {isGenaiFiltered && (
                <button
                  onClick={clearGenai}
                  className="ml-auto flex items-center gap-1.5 text-xs font-mono text-[#ac8aff] hover:underline cursor-pointer"
                >
                  <IconRefresh />
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ── Problem Grid ── */}
      <div className="w-full px-6 md:px-10 xl:px-16 py-10">

        {/* ── Coding tab ── */}
        {activeTab === 'coding' && (
          filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-[#767576] text-lg font-headline mb-1">No problems match your filters</div>
              <p className="text-[#484849] text-sm">Try adjusting the difficulty or category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((problem, index) => {
                  const d = D[problem.difficulty];
                  const descSnippet = problem.description
                    .replace(/`[^`]*`/g, (m) => m.slice(1, -1))
                    .replace(/\*\*([^*]+)\*\*/g, '$1')
                    .split('\n')[0]
                    .slice(0, 110);
                  const score = DIFFICULTY_SCORE[problem.id] ?? 50;

                  return (
                    <button
                      key={problem.id}
                      type="button"
                      onClick={() => setModalProblem({
                        id: problem.id,
                        title: problem.title,
                        difficulty: problem.difficulty,
                        type: 'coding',
                        href: `/interview/${problem.id}`,
                      })}
                      className={`group relative flex flex-col text-left bg-[#131314] ${d.topBorder} p-6 rounded-xl transition-colors duration-200 hover:bg-[#1a191b] cursor-pointer w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#85adff]`}
                    >
                      {/* Number + badge row */}
                      <div className="flex justify-between items-start mb-4">
                        <span className="font-mono text-xs text-[#484849]">
                          #{String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${d.badge}`}>
                          {problem.difficulty}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-headline font-bold text-white mb-2 leading-tight group-hover:text-[#85adff] transition-colors">
                        {problem.title}
                      </h3>

                      {/* Description */}
                      <p className="text-[#767576] text-xs line-clamp-2 mb-4 leading-relaxed flex-1">
                        {descSnippet}{problem.description.length > 110 ? '…' : ''}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        <span className="text-[10px] font-mono bg-[#262627] px-2 py-1 rounded text-[#adaaab] border border-white/5">
                          {problem.category}
                        </span>
                        {showCompanyTags && problem.companies?.slice(0, 2).map((c) => (
                          <span key={c} className="text-[10px] font-mono bg-[#262627] px-2 py-1 rounded text-[#adaaab] border border-white/5">
                            {c}
                          </span>
                        ))}
                        {showCompanyTags && (problem.companies?.length ?? 0) > 2 && (
                          <span className="text-[10px] text-[#484849] px-1">+{(problem.companies?.length ?? 0) - 2}</span>
                        )}
                      </div>

                      {/* Difficulty bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-[#484849] uppercase tracking-tight">
                          <span>Difficulty</span>
                          <span>{score}%</span>
                        </div>
                        <div className="w-full bg-[#0e0e0f] h-1 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${score}%`, backgroundColor: d.bar }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-center text-[#484849] text-xs font-mono mt-12">
                {filtered.length} problem{filtered.length !== 1 ? 's' : ''} shown &nbsp;·&nbsp; 45-minute timed sessions &nbsp;·&nbsp; AI-powered feedback
              </p>
            </>
          )
        )}

        {/* ── GenAI tab ── */}
        {activeTab === 'genai' && (
          filteredGenai.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-[#767576] text-lg font-headline mb-1">No problems match your filters</div>
              <p className="text-[#484849] text-sm">Try adjusting the difficulty or category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGenai.map((problem, index) => {
                  const d = D[problem.difficulty];
                  const descSnippet = problem.description.split('\n')[0].slice(0, 110);
                  const score = GENAI_DIFFICULTY_SCORE[problem.id] ?? 50;

                  return (
                    <button
                      key={problem.id}
                      type="button"
                      onClick={() => setModalProblem({
                        id: problem.id,
                        title: problem.title,
                        difficulty: problem.difficulty,
                        type: 'genai',
                        href: `/genai/${problem.id}`,
                      })}
                      className={`group relative flex flex-col text-left bg-[#131314] ${d.topBorder} p-6 rounded-xl transition-colors duration-200 hover:bg-[#1a191b] cursor-pointer w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ac8aff]`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className="font-mono text-xs text-[#484849]">
                          #{String(index + 1).padStart(2, '0')}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${d.badge}`}>
                          {problem.difficulty}
                        </span>
                      </div>

                      <h3 className="text-lg font-headline font-bold text-white mb-2 leading-tight group-hover:text-[#ac8aff] transition-colors">
                        {problem.title}
                      </h3>

                      <p className="text-[#767576] text-xs line-clamp-2 mb-4 leading-relaxed flex-1">
                        {descSnippet}{problem.description.length > 110 ? '…' : ''}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        <span className="text-[10px] font-mono bg-[#262627] px-2 py-1 rounded text-[#ac8aff] border border-[#ac8aff]/10">
                          {problem.category}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-[#484849] uppercase tracking-tight">
                          <span>Difficulty</span>
                          <span>{score}%</span>
                        </div>
                        <div className="w-full bg-[#0e0e0f] h-1 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${score}%`, backgroundColor: d.bar }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-center text-[#484849] text-xs font-mono mt-12">
                {filteredGenai.length} assessment{filteredGenai.length !== 1 ? 's' : ''} shown &nbsp;·&nbsp; No time limit &nbsp;·&nbsp; AI collaboration encouraged
              </p>
            </>
          )
        )}
        {/* ── GenAI Fluency tab ── */}
        {activeTab === 'fluency' && (
          <div className="max-w-2xl mx-auto py-4 space-y-10">

            {/* Intro card */}
            <div className="bg-[#1a191b] rounded-xl p-8 border border-[#9bffce]/10 space-y-5">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9bffce]">
                  Behavioral · STAR Format
                </span>
                <h2 className="text-2xl font-bold font-headline text-white mt-2">
                  GenAI Fluency Interview
                </h2>
                <p className="text-sm text-[#adaaab] mt-2 leading-relaxed">
                  3 randomly selected behavioral questions drawn from 40 real-world GenAI scenarios.
                  You will be evaluated on how you think about, communicate, and apply GenAI — not your ability to write code.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Questions', value: '3' },
                  { label: 'Format', value: 'STAR' },
                  { label: 'Duration', value: '~20–30m' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#131314] rounded-lg p-3 text-center border border-white/5">
                    <div className="text-xl font-bold font-headline text-[#9bffce]">{stat.value}</div>
                    <div className="text-[10px] font-mono text-[#767576] uppercase mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setModalProblem({
                  id: 'genai-fluency',
                  title: 'GenAI Fluency Interview',
                  difficulty: 'medium',
                  type: 'fluency',
                  href: '/genai-fluency',
                })}
                className="w-full py-3 font-bold font-headline rounded-md text-sm transition-all hover:brightness-110 active:scale-[0.98] cursor-pointer"
                style={{ background: '#9bffce', color: '#001f14' }}
              >
                Start a Session
              </button>
            </div>

            {/* Scoring criteria */}
            <div className="space-y-3">
              <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-[#adaaab]">
                7 Evaluation Criteria
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Specificity & Concreteness', desc: 'Real examples with named tools, outcomes, and context' },
                  { label: 'GenAI Literacy', desc: 'Understanding of how AI tools actually work and behave' },
                  { label: 'Critical Thinking & Evaluation', desc: 'How rigorously you review and validate AI output' },
                  { label: 'Judgment & Risk Awareness', desc: 'Knowing when GenAI is and isn\'t the right tool' },
                  { label: 'Responsibility & Ethics', desc: 'Data privacy, bias, IP, and accountability' },
                  { label: 'Learning Agility', desc: 'How you\'ve evolved your GenAI practice over time' },
                  { label: 'Communication & Influence', desc: 'How you explain GenAI to different stakeholders' },
                ].map((c) => (
                  <div key={c.label} className="bg-[#131314] rounded-lg p-4 border border-white/5">
                    <div className="text-xs font-bold font-headline text-white mb-1">{c.label}</div>
                    <div className="text-[11px] text-[#767576] leading-relaxed">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Question categories */}
            <div className="space-y-3">
              <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-[#adaaab]">
                Question Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {FLUENCY_CATEGORIES.map((cat) => (
                  <span
                    key={cat}
                    className="text-[11px] font-mono px-3 py-1.5 rounded-full border"
                    style={{ background: 'rgba(155,255,206,0.05)', color: '#9bffce', borderColor: 'rgba(155,255,206,0.15)' }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <InterviewStartModal problem={modalProblem} onClose={() => setModalProblem(null)} />
    </main>

      {/* ── Back to Top (portaled to body so fixed positioning is relative to viewport) ── */}
      {mounted && createPortal(
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a191b] border border-white/10 text-[#adaaab] text-xs font-mono shadow-lg hover:border-white/20 hover:text-white transition-all duration-300 cursor-pointer ${
            showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
          Back to top
        </button>,
        document.body
      )}
    </>
  );
}

export default function ProblemsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0e0e0f]" />}>
      <ProblemsPageInner />
    </Suspense>
  );
}
