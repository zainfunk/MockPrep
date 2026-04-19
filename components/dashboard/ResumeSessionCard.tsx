"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlayCircle } from "lucide-react";

interface ProblemSummary {
  id: string;
  title: string;
  type: "coding" | "genai";
}

interface InProgress {
  problem: ProblemSummary;
  timeElapsed: number;
  messageCount: number;
  savedAt: number;
}

const KEY_PREFIX = "placed:session:v1:";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m >= 45) return "ended";
  return `${m}m${s > 0 ? ` ${s}s` : ""}`;
}

function formatAge(savedAt: number): string {
  const diff = Date.now() - savedAt;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function ResumeSessionCard({ problemLookup }: { problemLookup: Record<string, ProblemSummary> }) {
  const [session, setSession] = useState<InProgress | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      let best: InProgress | null = null;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(KEY_PREFIX)) continue;
        const rest = key.slice(KEY_PREFIX.length);
        const colon = rest.indexOf(":");
        if (colon < 0) continue;
        const type = rest.slice(0, colon);
        const problemId = rest.slice(colon + 1);
        if (type !== "coding" && type !== "genai") continue;
        const problem = problemLookup[`${type}:${problemId}`];
        if (!problem) continue;
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        let parsed: { savedAt?: number; data?: { messages?: unknown[]; timeElapsed?: number } };
        try { parsed = JSON.parse(raw); } catch { continue; }
        if (!parsed.savedAt || Date.now() - parsed.savedAt > MAX_AGE_MS) continue;
        const messageCount = Array.isArray(parsed.data?.messages) ? parsed.data!.messages!.length : 0;
        if (messageCount === 0) continue;
        const timeElapsed = typeof parsed.data?.timeElapsed === "number" ? parsed.data.timeElapsed : 0;
        const candidate: InProgress = { problem, timeElapsed, messageCount, savedAt: parsed.savedAt };
        if (!best || candidate.savedAt > best.savedAt) best = candidate;
      }
      setSession(best);
    } catch {
      setSession(null);
    }
  }, [problemLookup]);

  if (!mounted || !session) return null;

  const href = session.problem.type === "coding"
    ? `/interview/${session.problem.id}`
    : `/genai/${session.problem.id}`;

  return (
    <Card className="border-2" style={{ borderColor: "var(--accent-blue)" }}>
      <CardContent className="pt-5">
        <div className="flex items-center gap-2 mb-3">
          <PlayCircle size={14} style={{ color: "var(--accent-blue)" }} />
          <p className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--accent-blue)" }}>
            Resume in progress
          </p>
        </div>
        <p className="text-sm font-semibold mb-1 truncate" style={{ color: "var(--text-primary)" }}>
          {session.problem.title}
        </p>
        <p className="text-xs mb-4" style={{ color: "var(--text-tertiary)" }}>
          {session.problem.type === "coding" ? "Coding interview" : "GenAI coding"}
          {" · "}
          {formatElapsed(session.timeElapsed)} elapsed
          {" · "}
          saved {formatAge(session.savedAt)}
        </p>
        <Link href={href}>
          <Button variant="primary" size="sm" className="w-full justify-center">
            Resume — won&apos;t count against quota
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
