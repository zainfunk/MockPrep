"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { LayoutDashboard, Code2, History, User, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard",  label: "Dashboard", icon: LayoutDashboard },
  { href: "/problems",   label: "Problems",  icon: Code2 },
  { href: "/history",    label: "History",   icon: History },
  { href: "/tracks",     label: "Tracks",    icon: Briefcase },
  { href: "/profile",    label: "Profile",   icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside
      className="fixed left-0 top-0 h-screen flex flex-col z-40 hidden lg:flex"
      style={{
        width: 220,
        background: "var(--surface-0)",
        borderRight: "1px solid var(--border-subtle)",
      }}
    >
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <span
          className="text-sm font-semibold tracking-tight"
          style={{ color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Mock<span style={{ color: "var(--accent-blue)" }}>Prep</span>
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 group",
                active
                  ? "font-medium"
                  : "hover:bg-[var(--surface-2)]"
              )}
              style={{
                background: active ? "rgba(133,173,255,0.1)" : undefined,
                color: active ? "var(--accent-blue)" : "var(--text-secondary)",
              }}
            >
              <Icon
                size={16}
                className={cn("flex-shrink-0 transition-colors", !active && "group-hover:text-[var(--text-primary)]")}
              />
              <span className={cn(!active && "group-hover:text-[var(--text-primary)]")}>{label}</span>
              {active && (
                <span className="ml-auto w-1 h-1 rounded-full" style={{ background: "var(--accent-blue)" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div
        className="px-4 py-4 flex items-center gap-3"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <UserButton afterSignOutUrl="/" />
        {user && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
              {user.firstName ?? user.username ?? "User"}
            </p>
            <p className="text-xs truncate" style={{ color: "var(--text-tertiary)" }}>
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
