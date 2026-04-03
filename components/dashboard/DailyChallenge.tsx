"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { DifficultyBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Zap } from "lucide-react";

interface DailyChallengeProps {
  problem: {
    id: string;
    title: string;
    difficulty: "easy" | "medium" | "hard";
    category: string;
  };
}

export function DailyChallenge({ problem }: DailyChallengeProps) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--text-tertiary)" }}>
            Daily Challenge
          </p>
          <Zap size={13} style={{ color: "var(--accent-blue)" }} />
        </div>
        <p className="text-sm font-medium mb-1 leading-snug" style={{ color: "var(--text-primary)" }}>
          {problem.title}
        </p>
        <div className="flex items-center gap-2 mb-4">
          <DifficultyBadge difficulty={problem.difficulty} />
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>{problem.category}</span>
        </div>
        <Link href={`/interview/${problem.id}`}>
          <Button size="sm" className="w-full justify-center">
            Start Interview
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
