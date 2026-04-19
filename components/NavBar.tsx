'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs';

interface LimitSnapshot {
  tier?: 'free' | 'pro';
  hasStripeCustomer?: boolean;
  unlimited?: boolean;
}

function CreditCardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>
  );
}

export default function NavBar() {
  const { isSignedIn, isLoaded } = useAuth();
  const [snapshot, setSnapshot] = useState<LimitSnapshot | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const dark = saved ? saved === 'dark' : true;
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  useEffect(() => {
    if (!isSignedIn) {
      setSnapshot(null);
      return;
    }
    fetch('/api/user/daily-limit')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setSnapshot(data))
      .catch(() => setSnapshot(null));
  }, [isSignedIn]);

  async function openPortal() {
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.url) window.location.href = data.url;
    } catch {}
  }

  const showManage = Boolean(snapshot?.hasStripeCustomer);

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
        <Link
          href="/pricing"
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          Pricing
        </Link>

        {/* Auth */}
        {isLoaded && (
          isSignedIn ? (
            <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8' } }}>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Pricing"
                  labelIcon={<SparklesIcon />}
                  href="/pricing"
                />
                {showManage && (
                  <UserButton.Action
                    label="Manage subscription"
                    labelIcon={<CreditCardIcon />}
                    onClick={openPortal}
                  />
                )}
              </UserButton.MenuItems>
            </UserButton>
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
