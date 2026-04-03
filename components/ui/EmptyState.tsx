import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
  variant?: "default" | "error";
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  variant = "default",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center rounded-xl border",
        className
      )}
      style={{
        background: "var(--surface-1)",
        borderColor: variant === "error" ? "rgba(248,113,113,0.15)" : "var(--border-subtle)",
      }}
    >
      {icon && (
        <div
          className="mb-4 text-3xl p-3 rounded-full"
          style={{ background: "var(--surface-2)", color: variant === "error" ? "#f87171" : "var(--text-tertiary)" }}
        >
          {icon}
        </div>
      )}
      <p
        className="text-sm font-medium mb-1"
        style={{ color: variant === "error" ? "#f87171" : "var(--text-primary)" }}
      >
        {title}
      </p>
      {description && (
        <p className="text-xs mb-5 max-w-xs" style={{ color: "var(--text-tertiary)" }}>
          {description}
        </p>
      )}
      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
