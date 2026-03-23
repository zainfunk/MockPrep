import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

interface DailyInterviewMeta {
  date: string;
  count: number;
}

const DAILY_LIMIT = 10;

async function getTodayUsage(userId: string): Promise<{ used: number; date: string }> {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const meta = user.privateMetadata as { dailyInterviews?: DailyInterviewMeta };
  const today = new Date().toISOString().slice(0, 10);

  if (!meta.dailyInterviews || meta.dailyInterviews.date !== today) {
    return { used: 0, date: today };
  }
  return { used: meta.dailyInterviews.count, date: today };
}

// GET /api/user/daily-limit — return current daily usage
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { used, date } = await getTodayUsage(userId);
  return NextResponse.json({ used, limit: DAILY_LIMIT, remaining: DAILY_LIMIT - used, date });
}

// POST /api/user/daily-limit — increment and deduct one interview
export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { used, date } = await getTodayUsage(userId);
  const newCount = used + 1;

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      dailyInterviews: { date, count: newCount },
    },
  });

  return NextResponse.json({ used: newCount, limit: DAILY_LIMIT, remaining: DAILY_LIMIT - newCount, date });
}
