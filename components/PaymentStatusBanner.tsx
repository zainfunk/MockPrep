'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

interface Snapshot {
  subscriptionStatus?: string | null;
  hasStripeCustomer?: boolean;
}

const PAST_DUE_STATUSES = new Set(['past_due', 'unpaid', 'incomplete']);

export default function PaymentStatusBanner() {
  const { isSignedIn } = useAuth();
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch('/api/user/daily-limit')
      .then((r) => (r.ok ? r.json() : null))
      .then(setSnap)
      .catch(() => setSnap(null));
  }, [isSignedIn]);

  async function openPortal() {
    setOpening(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.url) window.location.href = data.url;
    } catch {
      setOpening(false);
    }
  }

  if (
    dismissed ||
    !snap ||
    !snap.hasStripeCustomer ||
    !snap.subscriptionStatus ||
    !PAST_DUE_STATUSES.has(snap.subscriptionStatus)
  ) {
    return null;
  }

  return (
    <div className="fixed top-14 left-0 right-0 z-40 bg-amber-500/10 border-b border-amber-400/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-amber-200 min-w-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span className="truncate">
            <span className="font-semibold">Payment failed.</span>{' '}
            <span className="text-amber-300/80">Update your card to keep Pro access.</span>
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={openPortal}
            disabled={opening}
            className="rounded-md bg-amber-500 hover:bg-amber-400 text-amber-950 font-semibold px-3 py-1 text-xs transition disabled:opacity-60"
          >
            {opening ? 'Opening…' : 'Update card'}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="text-amber-300/70 hover:text-amber-200 px-1"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
