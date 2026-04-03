import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  active?: boolean;
}

export function Card({ children, className, hover = false, active = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-200",
        hover && "hover:border-[var(--border-active)] hover:-translate-y-0.5 cursor-pointer",
        active && "border-[var(--border-active)]",
        className
      )}
      style={{
        background: "var(--surface-1)",
        borderColor: active ? "var(--border-active)" : "var(--border-subtle)",
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 pt-5 pb-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 pb-5", className)} {...props}>
      {children}
    </div>
  );
}
