import { getSupabase as createClient } from "./supabase";

async function getAllSessionDates(userId: string, direction: "asc" | "desc" = "desc"): Promise<string[]> {
  const supabase = createClient();
  const [interview, genai, fluency] = await Promise.all([
    supabase.from("interview_sessions").select("created_at").eq("user_id", userId),
    supabase.from("genai_sessions").select("created_at").eq("user_id", userId),
    supabase.from("fluency_sessions").select("created_at").eq("user_id", userId),
  ]);

  const rows: { created_at: string }[] = [
    ...(interview.data ?? []),
    ...(genai.data ?? []),
    ...(fluency.data ?? []),
  ];

  const dates = Array.from(new Set(rows.map((r) => r.created_at.slice(0, 10)))).sort();
  return direction === "desc" ? dates.reverse() : dates;
}

export async function getCurrentStreak(userId: string): Promise<number> {
  const dates = await getAllSessionDates(userId, "desc");
  if (dates.length === 0) return 0;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const curr = new Date(dates[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (Math.round(diff) === 1) streak++;
    else break;
  }
  return streak;
}

export async function getBestStreak(userId: string): Promise<number> {
  const dates = await getAllSessionDates(userId, "asc");
  if (dates.length === 0) return 0;

  let best = 1, curr = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]);
    const now = new Date(dates[i]);
    const diff = (now.getTime() - prev.getTime()) / 86400000;
    if (Math.round(diff) === 1) { curr++; best = Math.max(best, curr); }
    else curr = 1;
  }
  return best;
}

export async function getLast14Days(userId: string): Promise<boolean[]> {
  const supabase = createClient();
  const since = new Date(Date.now() - 14 * 86400000).toISOString();
  const [interview, genai, fluency] = await Promise.all([
    supabase.from("interview_sessions").select("created_at").eq("user_id", userId).gte("created_at", since),
    supabase.from("genai_sessions").select("created_at").eq("user_id", userId).gte("created_at", since),
    supabase.from("fluency_sessions").select("created_at").eq("user_id", userId).gte("created_at", since),
  ]);

  const rows: { created_at: string }[] = [
    ...(interview.data ?? []),
    ...(genai.data ?? []),
    ...(fluency.data ?? []),
  ];

  const activeDays = new Set(rows.map((r) => r.created_at.slice(0, 10)));
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400000).toISOString().slice(0, 10);
    return activeDays.has(d);
  });
}
