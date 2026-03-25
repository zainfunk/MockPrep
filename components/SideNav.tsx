'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';

const T = {
  surfaceLow: '#131314',
  surfaceMid: '#1a191b',
  primary: '#85adff',
  secondary: '#ac8aff',
  tertiary: '#9bffce',
  textPrimary: '#ffffff',
  textSecond: '#adaaab',
  textMuted: '#767576',
  outline: 'rgba(72,72,73,0.15)',
};

const NAV_ITEMS = [
  {
    label: 'Practice',
    href: '/problems',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    label: 'History',
    href: '/history',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function SideNav() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const displayName = user?.firstName || user?.username || 'You';
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  return (
    <>
      <style>{`
        .sidenav-link { transition: background 0.15s ease, color 0.15s ease; text-decoration: none; }
        .sidenav-link:hover { background: rgba(255,255,255,0.03) !important; }
        .sidenav-link:hover .sidenav-label { color: ${T.textSecond} !important; }
      `}</style>
      <aside
        className="hidden lg:flex flex-col fixed left-0 z-40"
        style={{ top: 56, height: 'calc(100vh - 56px)', width: 240, background: T.surfaceLow }}
      >
        {/* User info */}
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${T.outline}` }}>
          {isSignedIn ? (
            <>
              <p style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.05em', color: T.primary, margin: 0 }}>
                {displayName.toUpperCase()}
              </p>
              <p style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: T.textMuted, marginTop: 3 }}>
                {memberSince ? `Since ${memberSince}` : 'Member'}
              </p>
            </>
          ) : (
            <p style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.05em', color: T.textMuted, margin: 0 }}>
              MOCKPREP
            </p>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-2">
          {NAV_ITEMS.map(({ label, href, icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={label}
                href={href}
                className="sidenav-link flex items-center gap-3"
                style={{
                  padding: '11px 24px',
                  color: isActive ? T.primary : T.textMuted,
                  background: isActive ? 'rgba(133,173,255,0.06)' : 'transparent',
                  borderLeft: isActive ? `2px solid ${T.primary}` : '2px solid transparent',
                }}
              >
                <span style={{ color: isActive ? T.primary : T.textMuted, flexShrink: 0 }}>{icon}</span>
                <span
                  className="sidenav-label"
                  style={{
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    fontSize: '0.625rem',
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: isActive ? T.primary : T.textMuted,
                  }}
                >
                  {label}
                </span>
                {isActive && (
                  <span style={{ marginLeft: 'auto', color: T.primary, opacity: 0.5 }}>
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer branding */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.outline}` }}>
          <p style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: T.textMuted, margin: 0 }}>
            © 2024 MockPrep
          </p>
          <p style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.5rem', letterSpacing: '0.06em', color: `${T.textMuted}80`, marginTop: 2 }}>
            Built for Architects
          </p>
        </div>
      </aside>
    </>
  );
}
