'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs';

export default function NavBar() {
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const dark = saved ? saved === 'dark' : true;
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-black border-b border-gray-800 flex items-center justify-between px-6">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center hover:opacity-80 transition-opacity"
        aria-label="Placed home"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/placedlogo.png" alt="Placed" className="h-7 w-auto dark:invert" />
      </Link>

      {/* Right side nav */}
      <div className="flex items-center gap-4">
        {/* Auth */}
        {isLoaded && (
          isSignedIn ? (
            <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }} />
          ) : (
            <SignInButton mode="modal">
              <button className="text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-1.5 rounded-lg transition-colors">
                Sign In
              </button>
            </SignInButton>
          )
        )}
      </div>
    </nav>
  );
}
