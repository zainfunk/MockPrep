"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { DifficultyBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { History } from "lucide-react";

interface Session {
  id: string;
  problemTitle: string;
  difficulty: "easy" | "medium" | "hard";
  overallScore: number;
  date: string;
}

interface RecentSessionsProps {
  sessions: Session[];
}

function scoreColor(score: number) {
  if (score >= 8) return "var(--accent-green)";
  if (score >= 6) return "var(--accent-amber)";
  return "var(--accent-red)";
}

export function RecentSessions({ sessions }: RecentSessionsProps) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--text-tertiary)" }}>
            Recent Sessions
          </p>
          <Link href="/history" className="text-xs transition-colors hover:opacity-80" style={{ color: "var(--accent-blue)" }}>
            View all →
          </Link>
        </div>

        {sessions.length === 0 ? (
          <EmptyState
            icon={<History size={18} />}
            title="No sessions yet"
            description="Complete your first interview to see your history here."
            className="py-8 border-0 bg-transparent"
          />
        ) : (
          <div className="space-y-2">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                style={{ background: "var(--surface-2)" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {s.problemTitle}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <DifficultyBadge difficulty={s.difficulty} />
                    <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>{s.date}</span>
                  </div>
                </div>
                <span
                  className="text-sm font-bold tabular-nums flex-shrink-0"
                  style={{ color: scoreColor(s.overallScore), fontFamily: "var(--font-space-grotesk)" }}
                >
                  {s.overallScore}/10
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
