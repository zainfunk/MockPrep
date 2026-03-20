'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [isDark, setIsDark] = useState(true);

  // Read initial preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const dark = saved ? saved === 'dark' : true;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <nav className="sticky top-0 z-50 h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6">
      {/* Logo */}
      <Link
        href="/"
        className="text-lg font-bold text-white hover:text-blue-400 transition-colors"
      >
        MockPrep
      </Link>

      {/* Right side nav */}
      <div className="flex items-center gap-4">
        <Link
          href="/problems"
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          Practice
        </Link>
        <Link
          href="/history"
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          History
        </Link>

        {/* Dark / Light toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 hover:text-white transition-colors"
        >
          {isDark ? (
            /* Sun icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            /* Moon icon */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}
