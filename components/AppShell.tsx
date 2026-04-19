'use client';

import { usePathname } from 'next/navigation';
import SideNav from './SideNav';
import MobileTabBar from './MobileTabBar';

function useNavVisible() {
  const pathname = usePathname();
  if (pathname === '/') return false;
  if (pathname.startsWith('/interview')) return false;
  if (pathname.startsWith('/genai')) return false;
  return true;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const showNav = useNavVisible();

  if (!showNav) return <>{children}</>;

  return (
    <>
      {/* Desktop sidebar */}
      <SideNav />
      {/* Content — offset for sidebar on desktop, padded for tab bar on mobile */}
      <div className="lg:ml-60 pb-16 lg:pb-0">{children}</div>
      {/* Mobile bottom tab bar */}
      <MobileTabBar />
    </>
  );
}
