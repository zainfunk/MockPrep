"use client";

import { Card, CardContent } from "@/components/ui/Card";

interface SessionLimitWidgetProps {
  used: number;
  limit: number;
}

export function SessionLimitWidget({ used, limit }: SessionLimitWidgetProps) {
  const pct = Math.min(1, used / limit);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * (1 - pct);
  const remaining = limit - used;

  const color = pct >= 1 ? "var(--accent-red)" : pct >= 0.8 ? "var(--accent-amber)" : "var(--accent-blue)";

  return (
    <Card>
      <CardContent className="pt-5">
        <p className="text-xs font-medium tracking-wide uppercase mb-4" style={{ color: "var(--text-tertiary)" }}>
          Daily Sessions
        </p>
        <div className="flex items-center gap-5">
          {/* Ring */}
          <svg width={72} height={72} style={{ flexShrink: 0 }}>
            <circle
              cx={36} cy={36} r={radius}
              fill="none"
              stroke="var(--surface-3)"
              strokeWidth={5}
            />
            <circle
              cx={36} cy={36} r={radius}
              fill="none"
              stroke={color}
              strokeWidth={5}
              strokeDasharray={circumference}
              strokeDashoffset={dash}
              strokeLinecap="round"
              transform="rotate(-90 36 36)"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
            <text x={36} y={40} textAnchor="middle" style={{ fill: "var(--text-primary)", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-space-grotesk)" }}>
              {used}/{limit}
            </text>
          </svg>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {remaining > 0 ? `${remaining} remaining` : "Limit reached"}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              Resets at midnight
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
