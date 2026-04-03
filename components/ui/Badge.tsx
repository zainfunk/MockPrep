import { cn } from "@/lib/utils";

type DifficultyLevel = "easy" | "medium" | "hard";
type StatusLevel = "not-started" | "attempted" | "completed";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  className?: string;
}

interface StatusDotProps {
  status: StatusLevel;
  className?: string;
}

const difficultyConfig: Record<DifficultyLevel, { label: string; color: string; bg: string }> = {
  easy:   { label: "Easy",   color: "#4ade80", bg: "rgba(74,222,128,0.1)"  },
  medium: { label: "Medium", color: "#fbbf24", bg: "rgba(251,191,36,0.1)"  },
  hard:   { label: "Hard",   color: "#f87171", bg: "rgba(248,113,113,0.1)" },
};

const statusConfig: Record<StatusLevel, { color: string }> = {
  "not-started": { color: "rgba(240,240,242,0.25)" },
  "attempted":   { color: "#fbbf24" },
  "completed":   { color: "#4ade80" },
};

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border border-white/8",
        className
      )}
      style={{ background: "var(--surface-3)", color: "var(--text-secondary)" }}
    >
      {children}
    </span>
  );
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const cfg = difficultyConfig[difficulty];
  return (
    <span
      className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", className)}
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}

export function StatusDot({ status, className }: StatusDotProps) {
  const cfg = statusConfig[status];
  return (
    <span
      className={cn("inline-block rounded-full flex-shrink-0", className)}
      style={{ width: 7, height: 7, background: cfg.color }}
      title={status}
    />
  );
}
