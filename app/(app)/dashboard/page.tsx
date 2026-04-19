import { auth } from "@clerk/nextjs/server";
import { problems } from "@/lib/problems";
import { genaiProblems } from "@/lib/genaiProblems";
import { getCurrentStreak, getBestStreak, getLast14Days } from "@/lib/streaks";
import { getSupabase } from "@/lib/supabase";
import { loadUserState } from "@/lib/subscription";
import { StreakWidget } from "@/components/dashboard/StreakWidget";
import { DailyChallenge } from "@/components/dashboard/DailyChallenge";
import { SessionLimitWidget } from "@/components/dashboard/SessionLimitWidget";
import { RecentSessions } from "@/components/dashboard/RecentSessions";
import { ProgressSummary } from "@/components/dashboard/ProgressSummary";
import { ResumeSessionCard } from "@/components/dashboard/ResumeSessionCard";

interface UnifiedSession {
  id: string;
  problemTitle: string;
  difficulty: "easy" | "medium" | "hard";
  overallScore: number;
  createdAt: string;
}

async function getDashboardData(userId: string) {
  const supabase = getSupabase();

  const [
    currentStreak,
    bestStreak,
    last14Days,
    state,
    interviewRes,
    genaiRes,
    fluencyRes,
  ] = await Promise.all([
    getCurrentStreak(userId),
    getBestStreak(userId),
    getLast14Days(userId),
    loadUserState(userId),
    supabase
      .from("interview_sessions")
      .select("id, problem_title, difficulty, overall_score, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("genai_sessions")
      .select("id, problem_title, difficulty, average_score, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("fluency_sessions")
      .select("id, total_score, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const merged: UnifiedSession[] = [
    ...((interviewRes.data ?? []).map((s) => ({
      id: s.id,
      problemTitle: s.problem_title,
      difficulty: (s.difficulty ?? "medium") as "easy" | "medium" | "hard",
      overallScore: Number(s.overall_score ?? 0),
      createdAt: s.created_at,
    }))),
    ...((genaiRes.data ?? []).map((s) => ({
      id: s.id,
      problemTitle: s.problem_title,
      difficulty: (s.difficulty ?? "medium") as "easy" | "medium" | "hard",
      overallScore: Number(s.average_score ?? 0),
      createdAt: s.created_at,
    }))),
    ...((fluencyRes.data ?? []).map((s) => ({
      id: s.id,
      problemTitle: "GenAI Fluency Assessment",
      difficulty: "medium" as const,
      overallScore: Math.round(Number(s.total_score ?? 0) / 10),
      createdAt: s.created_at,
    }))),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const recent = merged.slice(0, 5);

  const totalCompleted = merged.length;
  const uniqueTitles = new Set(merged.map((s) => s.problemTitle));
  const totalProblems = problems.length + genaiProblems.length + 1;

  return {
    currentStreak,
    bestStreak,
    last14Days,
    recent,
    state,
    totalCompleted,
    uniqueTitles: uniqueTitles.size,
    totalProblems,
  };
}

function getDailyProblem() {
  const dayOfYear = Math.floor(Date.now() / 86400000);
  return problems[dayOfYear % problems.length];
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const {
    currentStreak,
    bestStreak,
    last14Days,
    recent,
    state,
    totalCompleted,
    uniqueTitles,
    totalProblems,
  } = await getDashboardData(userId);

  const dailyProblem = getDailyProblem();

  const recentSessions = recent.map((s) => ({
    id: s.id,
    problemTitle: s.problemTitle,
    difficulty: s.difficulty,
    overallScore: s.overallScore,
    date: new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  const used = state.unlimited ? 0 : state.usage.sessionIds.length;
  const limit = state.unlimited ? 9999 : state.limit;

  const problemLookup: Record<string, { id: string; title: string; type: "coding" | "genai" }> = {};
  for (const p of problems) problemLookup[`coding:${p.id}`] = { id: p.id, title: p.title, type: "coding" };
  for (const p of genaiProblems) problemLookup[`genai:${p.id}`] = { id: p.id, title: p.title, type: "genai" };

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold mb-1"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-space-grotesk)" }}
        >
          Dashboard
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          {" · "}
          <span className="capitalize">{state.unlimited ? "Unlimited" : state.tier}</span> plan
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="space-y-4">
          <ResumeSessionCard problemLookup={problemLookup} />
          <StreakWidget
            currentStreak={currentStreak}
            bestStreak={bestStreak}
            last14Days={last14Days}
          />
          <DailyChallenge
            problem={{
              id: dailyProblem.id,
              title: dailyProblem.title,
              difficulty: dailyProblem.difficulty as "easy" | "medium" | "hard",
              category: dailyProblem.category,
            }}
          />
          <SessionLimitWidget used={used} limit={limit} />
        </div>

        {/* Center column */}
        <div className="lg:col-span-1 space-y-4">
          <RecentSessions sessions={recentSessions} />
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <ProgressSummary
            attempted={totalCompleted}
            completed={uniqueTitles}
            total={totalProblems}
          />
        </div>
      </div>
    </div>
  );
}
