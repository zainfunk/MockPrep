"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";

interface ProgressSummaryProps {
  attempted: number;
  completed: number;
  total: number;
}

export function ProgressSummary({ attempted, completed, total }: ProgressSummaryProps) {
  return (
    <Card>
      <CardContent className="pt-5">
        <p className="text-xs font-medium tracking-wide uppercase mb-4" style={{ color: "var(--text-tertiary)" }}>
          Your Progress
        </p>

        <div className="space-y-3 mb-5">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Sessions completed</span>
              <span className="text-xs tabular-nums" style={{ color: "var(--text-primary)" }}>{attempted}</span>
            </div>
            <ProgressBar value={Math.min(100, (attempted / Math.max(total, 1)) * 100)} color="var(--accent-blue)" />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Problems practiced</span>
              <span className="text-xs tabular-nums" style={{ color: "var(--text-primary)" }}>{completed} / {total}</span>
            </div>
            <ProgressBar value={(completed / Math.max(total, 1)) * 100} color="var(--accent-green)" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Link href="/problems">
            <Button variant="secondary" size="sm" className="w-full justify-center">
              Browse All Problems
            </Button>
          </Link>
          <Link href="/problems?tab=genai">
            <Button variant="ghost" size="sm" className="w-full justify-center">
              GenAI Fluency →
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
