'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { problems } from '@/lib/problems';
import type { Difficulty } from '@/lib/problems';

const DIFFICULTY_COLORS: Record<Difficulty, { badge: string; dot: string }> = {
  easy: {
    badge: 'bg-green-900/60 text-green-300 border border-green-700/50',
    dot: 'bg-green-400',
  },
  medium: {
    badge: 'bg-yellow-900/60 text-yellow-300 border border-yellow-700/50',
    dot: 'bg-yellow-400',
  },
  hard: {
    badge: 'bg-red-900/60 text-red-300 border border-red-700/50',
    dot: 'bg-red-400',
  },
};

export default function ProblemsPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'' | Difficulty>('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = useMemo(() => {
    const set = new Set(problems.map((p) => p.category));
    return Array.from(set).sort();
  }, []);

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (selectedDifficulty && p.difficulty !== selectedDifficulty) return false;
      if (selectedCategory && p.category !== selectedCategory) return false;
      return true;
    });
  }, [selectedDifficulty, selectedCategory]);

  const counts = useMemo(() => {
    const easy = problems.filter((p) => p.difficulty === 'easy').length;
    const medium = problems.filter((p) => p.difficulty === 'medium').length;
    const hard = problems.filter((p) => p.difficulty === 'hard').length;
    return { easy, medium, hard };
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Choose a Problem</h1>
          <p className="text-gray-400 text-lg">
            {problems.length} problems &nbsp;•&nbsp;
            <span className="text-green-400">{counts.easy} easy</span>&nbsp;•&nbsp;
            <span className="text-yellow-400">{counts.medium} medium</span>&nbsp;•&nbsp;
            <span className="text-red-400">{counts.hard} hard</span>
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Difficulty toggles */}
          <div className="flex gap-2">
            {(['', 'easy', 'medium', 'hard'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  selectedDifficulty === d
                    ? d === ''
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : d === 'easy'
                      ? 'bg-green-700 border-green-500 text-white'
                      : d === 'medium'
                      ? 'bg-yellow-700 border-yellow-500 text-white'
                      : 'bg-red-700 border-red-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'
                }`}
              >
                {d === '' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>

          {/* Category dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 hover:border-gray-500 transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Result count */}
          {(selectedDifficulty || selectedCategory) && (
            <span className="text-gray-500 text-sm">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Problem Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No problems match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((problem) => {
              const colors = DIFFICULTY_COLORS[problem.difficulty];
              const descSnippet = problem.description
                .replace(/`[^`]*`/g, (m) => m.slice(1, -1))
                .replace(/\*\*([^*]+)\*\*/g, '$1')
                .split('\n')[0]
                .slice(0, 100);

              return (
                <Link
                  key={problem.id}
                  href={`/interview/${problem.id}`}
                  className="block bg-gray-900 border border-gray-700 rounded-xl p-5 hover:border-blue-500 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors leading-snug">
                      {problem.title}
                    </h3>
                    <span
                      className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colors.badge}`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  <span className="inline-block text-xs text-gray-500 bg-gray-800 rounded px-2 py-0.5 mb-3">
                    {problem.category}
                  </span>

                  <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                    {descSnippet}
                    {problem.description.length > 100 ? '…' : ''}
                  </p>
                </Link>
              );
            })}
          </div>
        )}

        <p className="text-center text-gray-600 text-sm mt-12">
          45 minute sessions &nbsp;•&nbsp; AI-powered feedback
        </p>
      </div>
    </main>
  );
}
