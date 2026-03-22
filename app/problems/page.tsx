'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { problems } from '@/lib/problems';
import type { Difficulty } from '@/lib/problems';
import { genaiProblems } from '@/lib/genaiProblems';

// Global difficulty score (0–100) per problem.
const GENAI_DIFFICULTY_SCORE: Record<string, number> = {
  // Medium: spread across 28–55 to match coding mediums (32–60)
  'find-duplicates-ai': 28,
  'csv-report-ai': 38,
  'text-chunker-ai': 44,
  'json-flattener-ai': 52,
  // Hard: spread across 65–93 to match coding hards (63–95)
  'lru-cache-ai': 65,
  'trie-autocomplete-ai': 72,
  'log-analyzer-ai': 78,
  'session-analyzer-ai': 83,
  'rate-limiter-ai': 87,
  'expression-evaluator-ai': 93,
};

const DIFFICULTY_SCORE: Record<string, number> = {
  'palindrome-number': 12,
  'two-sum': 16,
  'best-time-to-buy-sell-stock': 20,
  'valid-parentheses': 24,
  'maximum-subarray': 27,
  'reverse-linked-list': 29,
  'merge-two-sorted-lists': 32,
  'longest-substring': 42,
  'binary-tree-level-order-traversal': 45,
  'container-with-most-water': 48,
  'product-of-array-except-self': 51,
  '3sum': 54,
  'coin-change': 57,
  'longest-palindromic-substring': 60,
  'word-search': 63,
  'merge-k-sorted-lists': 70,
  'trapping-rain-water': 77,
  'word-ladder': 82,
  'n-queens': 88,
  'median-of-two-sorted-arrays': 95,
};

const DIFFICULTY: Record<Difficulty, { badge: string; text: string; bar: string; active: string }> = {
  easy: {
    badge: 'bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700/40',
    text: 'text-green-600 dark:text-green-400',
    bar: 'bg-green-500',
    active: 'bg-green-100 border-green-400 text-green-800 dark:bg-green-800/60 dark:border-green-500 dark:text-green-200',
  },
  medium: {
    badge: 'bg-yellow-100 text-yellow-700 border border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700/40',
    text: 'text-yellow-600 dark:text-yellow-400',
    bar: 'bg-yellow-500',
    active: 'bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-800/60 dark:border-yellow-500 dark:text-yellow-200',
  },
  hard: {
    badge: 'bg-red-100 text-red-700 border border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700/40',
    text: 'text-red-600 dark:text-red-400',
    bar: 'bg-red-500',
    active: 'bg-red-100 border-red-400 text-red-800 dark:bg-red-800/60 dark:border-red-500 dark:text-red-200',
  },
};

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="8" strokeWidth="3" strokeLinecap="round" />
      <line x1="12" y1="12" x2="12" y2="16" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function ProblemsPageInner() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'genai' ? 'genai' : 'coding';
  const [activeTab, setActiveTab] = useState<'coding' | 'genai'>(initialTab);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'' | Difficulty>('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [genaiDifficulty, setGenaiDifficulty] = useState<'' | Difficulty>('');
  const [genaiCategory, setGenaiCategory] = useState('');

  const categories = useMemo(() => {
    const set = new Set(problems.map((p) => p.category));
    return Array.from(set).sort();
  }, []);

  const genaiCategories = useMemo(() => {
    const set = new Set(genaiProblems.map((p) => p.category));
    return Array.from(set).sort();
  }, []);

  const DIFFICULTY_ORDER: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2 };

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (selectedDifficulty && p.difficulty !== selectedDifficulty) return false;
      if (selectedCategory && p.category !== selectedCategory) return false;
      return true;
    });
  }, [selectedDifficulty, selectedCategory]);

  const filteredGenai = useMemo(() => {
    return genaiProblems
      .filter((p) => {
        if (genaiDifficulty && p.difficulty !== genaiDifficulty) return false;
        if (genaiCategory && p.category !== genaiCategory) return false;
        return true;
      })
      .sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]);
  }, [genaiDifficulty, genaiCategory]);

  const counts = useMemo(() => ({
    easy: problems.filter((p) => p.difficulty === 'easy').length,
    medium: problems.filter((p) => p.difficulty === 'medium').length,
    hard: problems.filter((p) => p.difficulty === 'hard').length,
  }), []);

  const isFiltered = selectedDifficulty || selectedCategory;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">

      {/* ── Header ── */}
      <div className="relative border-b border-gray-200/60 dark:border-gray-800/60 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: activeTab === 'genai'
              ? 'radial-gradient(ellipse 60% 80% at 50% -20%, rgba(168,85,247,0.1) 0%, transparent 65%)'
              : 'radial-gradient(ellipse 60% 80% at 50% -20%, rgba(59,130,246,0.1) 0%, transparent 65%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Practice Problems</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {activeTab === 'coding'
                  ? 'Select a problem to start a 45-minute AI interview session.'
                  : 'Assess how effectively you use AI tools to solve real problems.'}
              </p>
            </div>

            {/* Stat pills — only for coding tab */}
            {activeTab === 'coding' && (
              <div className="flex items-center gap-px bg-gray-200 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700/60 rounded-xl overflow-hidden shrink-0">
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(selectedDifficulty === d ? '' : d)}
                    aria-pressed={selectedDifficulty === d}
                    className={`flex flex-col items-center px-5 py-3 transition-colors ${
                      selectedDifficulty === d ? 'bg-gray-300 dark:bg-gray-700/80' : 'bg-white dark:bg-gray-900/60 hover:bg-gray-100 dark:hover:bg-gray-800/60'
                    }`}
                  >
                    <span className={`text-xl font-bold ${DIFFICULTY[d].text}`}>{counts[d]}</span>
                    <span className="text-gray-500 text-xs capitalize">{d}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-6">
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab('coding')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'coding'
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-gray-700'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Coding Problems
          </button>
          <button
            onClick={() => setActiveTab('genai')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'genai'
                ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm border border-gray-200 dark:border-gray-700'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            GenAI Fluency
            <span className="text-xs bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-semibold leading-none">
              New
            </span>
          </button>
        </div>
      </div>

      {/* ── Coding Tab ── */}
      {activeTab === 'coding' && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="text-gray-500 text-sm font-medium hidden sm:block">Filter:</span>

            <div className="flex gap-2" role="group" aria-label="Filter by difficulty">
              {(['', 'easy', 'medium', 'hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  aria-pressed={selectedDifficulty === d}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                    selectedDifficulty === d
                      ? d === ''
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : DIFFICULTY[d].active
                      : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {d === '' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 hidden sm:block" aria-hidden />

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filter by category"
                className="w-44 appearance-none bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            <div className="group relative flex items-center gap-1 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors cursor-default ml-auto" aria-label="Bar length indicates relative difficulty across all problems">
              <InfoIcon />
              <span className="text-xs hidden sm:block">Difficulty bars</span>
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 text-center leading-relaxed shadow-xl">
                Bar length shows relative difficulty across the full problem set, not just within a tier.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-200 dark:border-t-gray-700" />
              </div>
            </div>

            {isFiltered && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">
                  {filtered.length} of {problems.length}
                </span>
                <button
                  onClick={() => { setSelectedDifficulty(''); setSelectedCategory(''); }}
                  className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-400/50 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No problems match your filters</p>
              <p className="text-gray-500 text-sm">Try adjusting the difficulty or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((problem) => {
                const d = DIFFICULTY[problem.difficulty];
                const descSnippet = problem.description
                  .replace(/`[^`]*`/g, (m) => m.slice(1, -1))
                  .replace(/\*\*([^*]+)\*\*/g, '$1')
                  .split('\n')[0]
                  .slice(0, 110);

                return (
                  <Link
                    key={problem.id}
                    href={`/interview/${problem.id}`}
                    className="group flex flex-col bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label={`Start interview: ${problem.title}, ${problem.difficulty} difficulty, ${problem.category}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${d.badge}`}>
                        {problem.difficulty}
                      </span>
                      <span className="text-gray-600 group-hover:text-blue-400 transition-colors mt-0.5">
                        <ArrowIcon />
                      </span>
                    </div>

                    <h2 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors leading-snug mb-2 text-[15px]">
                      {problem.title}
                    </h2>

                    <span className="inline-block text-xs text-gray-500 bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 rounded-md px-2 py-0.5 mb-3 w-fit">
                      {problem.category}
                    </span>

                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mt-auto">
                      {descSnippet}{problem.description.length > 110 ? '...' : ''}
                    </p>

                    <div className="mt-4 h-0.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${d.bar}`}
                        style={{ width: `${DIFFICULTY_SCORE[problem.id] ?? 50}%` }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {filtered.length > 0 && (
            <p className="text-center text-gray-700 text-sm mt-12">
              {filtered.length} problem{filtered.length !== 1 ? 's' : ''} shown &nbsp;·&nbsp; 45-minute timed sessions &nbsp;·&nbsp; AI-powered feedback
            </p>
          )}
        </div>
      )}

      {/* ── GenAI Tab ── */}
      {activeTab === 'genai' && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="text-gray-500 text-sm font-medium hidden sm:block">Filter:</span>

            <div className="flex gap-2" role="group" aria-label="Filter by difficulty">
              {(['', 'easy', 'medium', 'hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setGenaiDifficulty(d)}
                  aria-pressed={genaiDifficulty === d}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                    genaiDifficulty === d
                      ? d === ''
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : DIFFICULTY[d].active
                      : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {d === '' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-gray-300 dark:bg-gray-700 hidden sm:block" aria-hidden />

            <div className="relative">
              <select
                value={genaiCategory}
                onChange={(e) => setGenaiCategory(e.target.value)}
                aria-label="Filter by category"
                className="w-44 appearance-none bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
              >
                <option value="">All Categories</option>
                {genaiCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            <div className="group relative flex items-center gap-1 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors cursor-default ml-auto" aria-label="Bar length indicates relative difficulty">
              <InfoIcon />
              <span className="text-xs hidden sm:block">Difficulty bars</span>
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 text-center leading-relaxed shadow-xl">
                Bar length shows relative difficulty across the full problem set, not just within a tier.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-200 dark:border-t-gray-700" />
              </div>
            </div>

            {(genaiDifficulty || genaiCategory) && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">
                  {filteredGenai.length} of {genaiProblems.length}
                </span>
                <button
                  onClick={() => { setGenaiDifficulty(''); setGenaiCategory(''); }}
                  className="text-xs text-purple-400 hover:text-purple-300 border border-purple-500/30 hover:border-purple-400/50 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {filteredGenai.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No problems match your filters</p>
              <p className="text-gray-500 text-sm">Try adjusting the difficulty or category.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredGenai.map((problem) => {
              const d = DIFFICULTY[problem.difficulty];
              const descSnippet = problem.description.split('\n')[0].slice(0, 110);
              return (
                <Link
                  key={problem.id}
                  href={`/genai/${problem.id}`}
                  className="group flex flex-col bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  aria-label={`Start GenAI session: ${problem.title}, ${problem.difficulty} difficulty`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${d.badge}`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-gray-600 group-hover:text-purple-400 transition-colors mt-0.5">
                      <ArrowIcon />
                    </span>
                  </div>

                  <h2 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors leading-snug mb-2 text-[15px]">
                    {problem.title}
                  </h2>

                  <span className="inline-block text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50 rounded-md px-2 py-0.5 mb-3 w-fit">
                    {problem.category}
                  </span>

                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mt-auto">
                    {descSnippet}{problem.description.length > 110 ? '...' : ''}
                  </p>

                  <div className="mt-4 h-0.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${d.bar}`}
                      style={{ width: `${GENAI_DIFFICULTY_SCORE[problem.id] ?? 50}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
          )}

          {filteredGenai.length > 0 && (
            <p className="text-center text-gray-700 text-sm mt-12">
              {filteredGenai.length} assessment{filteredGenai.length !== 1 ? 's' : ''} shown &nbsp;·&nbsp; No time limit &nbsp;·&nbsp; AI collaboration encouraged
            </p>
          )}
        </div>
      )}
    </main>
  );
}

export default function ProblemsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
      <ProblemsPageInner />
    </Suspense>
  );
}
