import { auth } from "@clerk/nextjs/server";
import { problems } from "@/lib/problems";
import { getCurrentStreak, getBestStreak, getLast14Days } from "@/lib/streaks";
import { getSupabase } from "@/lib/supabase";
import { StreakWidget } from "@/components/dashboard/StreakWidget";
import { DailyChallenge } from "@/components/dashboard/DailyChallenge";
import { SessionLimitWidget } from "@/components/dashboard/SessionLimitWidget";
import { RecentSessions } from "@/components/dashboard/RecentSessions";
import { ProgressSummary } from "@/components/dashboard/ProgressSummary";

async function getDashboardData(userId: string) {
  const supabase = getSupabase();

  const [
    currentStreak,
    bestStreak,
    last14Days,
    { data: sessions },
    { data: limitData },
  ] = await Promise.all([
    getCurrentStreak(userId),
    getBestStreak(userId),
    getLast14Days(userId),
    supabase
      .from("interview_sessions")
      .select("id, problem_title, difficulty, overall_score, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("interview_sessions")
      .select("id")
      .eq("user_id", userId)
      .gte("created_at", new Date().toISOString().slice(0, 10)),
  ]);

  return { currentStreak, bestStreak, last14Days, sessions: sessions ?? [], used: limitData?.length ?? 0 };
}

function getDailyProblem() {
  const dayOfYear = Math.floor(Date.now() / 86400000);
  return problems[dayOfYear % problems.length];
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const { currentStreak, bestStreak, last14Days, sessions, used } = await getDashboardData(userId);
  const dailyProblem = getDailyProblem();
  const limit = 5;

  const recentSessions = sessions.map((s: {
    id: string;
    problem_title: string;
    difficulty: "easy" | "medium" | "hard";
    overall_score: number;
    created_at: string;
  }) => ({
    id: s.id,
    problemTitle: s.problem_title,
    difficulty: (s.difficulty ?? "medium") as "easy" | "medium" | "hard",
    overallScore: s.overall_score ?? 0,
    date: new Date(s.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

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
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="space-y-4">
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
            attempted={Math.min(recentSessions.length * 3, problems.length)}
            completed={Math.floor(recentSessions.length * 1.5)}
            total={problems.length}
          />
        </div>
      </div>
    </div>
  );
}
