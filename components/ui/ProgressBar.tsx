import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  height?: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  color = "var(--accent-blue)",
  height = 4,
  className,
  showLabel = false,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height, background: "var(--surface-3)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${clamped}%`, background: color }}
        />
      </div>
      {showLabel && (
        <span className="text-xs tabular-nums" style={{ color: "var(--text-tertiary)", minWidth: 32 }}>
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
