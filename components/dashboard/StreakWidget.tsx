"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Flame } from "lucide-react";

interface StreakWidgetProps {
  currentStreak: number;
  bestStreak: number;
  last14Days: boolean[];
}

export function StreakWidget({ currentStreak, bestStreak, last14Days }: StreakWidgetProps) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--text-tertiary)" }}>
            Current Streak
          </p>
          <Flame size={14} style={{ color: currentStreak > 0 ? "var(--accent-amber)" : "var(--text-tertiary)" }} />
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span
            className="text-4xl font-bold tabular-nums"
            style={{ color: currentStreak > 0 ? "var(--accent-amber)" : "var(--text-primary)", fontFamily: "var(--font-space-grotesk)" }}
          >
            {currentStreak}
          </span>
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>days</span>
        </div>
        <p className="text-xs mb-5" style={{ color: "var(--text-tertiary)" }}>
          Best: {bestStreak} days
        </p>

        {/* 14-day dot calendar */}
        <div className="flex gap-1">
          {last14Days.map((active, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: 6,
                background: active ? "var(--accent-amber)" : "var(--surface-3)",
                opacity: active ? 1 : 0.5,
              }}
              title={`${13 - i} days ago`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>14d ago</span>
          <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>Today</span>
        </div>
      </CardContent>
    </Card>
  );
}
