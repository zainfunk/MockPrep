import { getSupabase as createClient } from "./supabase";

export async function getCurrentStreak(userId: string): Promise<number> {
  const supabase = createClient();
  const { data } = await supabase
    .from("interview_sessions")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!data || data.length === 0) return 0;

  const dates = Array.from(new Set(data.map((s) => s.created_at.slice(0, 10)))).sort().reverse();
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
  const supabase = createClient();
  const { data } = await supabase
    .from("interview_sessions")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (!data || data.length === 0) return 0;

  const dates = Array.from(new Set(data.map((s) => s.created_at.slice(0, 10))));
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
  const { data } = await supabase
    .from("interview_sessions")
    .select("created_at")
    .eq("user_id", userId)
    .gte("created_at", since);

  const activeDays = new Set((data ?? []).map((s) => s.created_at.slice(0, 10)));
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400000).toISOString().slice(0, 10);
    return activeDays.has(d);
  });
}
