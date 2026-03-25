'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const T = {
  surface: '#0e0e0f',
  surfaceLow: '#131314',
  primary: '#85adff',
  textMuted: '#767576',
  outline: 'rgba(72,72,73,0.15)',
};

const TABS = [
  {
    label: 'Practice',
    href: '/problems',
    icon: (active: boolean) => (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} viewBox="0 0 24 24">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
  },
  {
    label: 'History',
    href: '/history',
    icon: (active: boolean) => (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/profile',
    icon: (active: boolean) => (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex"
      style={{
        background: T.surfaceLow,
        borderTop: `1px solid ${T.outline}`,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({ label, href, icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={label}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3"
            style={{
              color: active ? T.primary : T.textMuted,
              textDecoration: 'none',
              position: 'relative',
            }}
          >
            {active && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '20%',
                  right: '20%',
                  height: 2,
                  background: T.primary,
                  borderRadius: '0 0 2px 2px',
                }}
              />
            )}
            {icon(active)}
            <span
              style={{
                fontFamily: 'var(--font-jetbrains-mono), monospace',
                fontSize: '0.5625rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
