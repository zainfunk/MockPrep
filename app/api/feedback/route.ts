import Anthropic from '@anthropic-ai/sdk';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';
import { ensureInterviewQuota } from '@/lib/subscription';

const client = new Anthropic();
const MAX_BODY_BYTES = 300_000;

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const quota = await ensureInterviewQuota(userId);
  if (!quota.ok) return NextResponse.json({ error: quota.error }, { status: quota.status });

  const rl = rateLimit(`feedback:${userId}`, 30, 60 * 60 * 1000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Feedback rate limit reached. Try again in ${rl.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

  let parsed: { messages?: unknown; code?: string; problemTitle?: string; timeElapsed?: number };
  try { parsed = JSON.parse(raw); } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }
  const { messages, code, problemTitle, timeElapsed } = parsed;
  if (!Array.isArray(messages) || typeof problemTitle !== 'string' || typeof timeElapsed !== 'number') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const conversationText = messages
    .map((m: { role: string; content: string }) => `${m.role.toUpperCase()}: ${m.content}`)
    .join('\n\n');

  const minutesElapsed = Math.floor(timeElapsed / 60);
  const secondsElapsed = timeElapsed % 60;

  const prompt = `You are reviewing a mock technical interview session. Analyze the conversation and code below, then provide structured feedback.

Problem: ${problemTitle}
Time used: ${minutesElapsed}m ${secondsElapsed}s out of 45 minutes

--- CONVERSATION ---
${conversationText}

--- FINAL CODE ---
\`\`\`
${code || '(No code written)'}
\`\`\`

Provide a JSON response with exactly this structure (no markdown, just raw JSON):
{
  "communicationScore": <1-10 integer>,
  "communicationExplanation": "<2-3 sentence explanation>",
  "problemSolvingScore": <1-10 integer>,
  "problemSolvingExplanation": "<2-3 sentence explanation>",
  "codeQualityScore": <1-10 integer>,
  "codeQualityExplanation": "<2-3 sentence explanation>",
  "timeManagement": "<1-2 sentence note about how they used their time>",
  "topImprovements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "closingNote": "<1-2 sentence encouraging closing note>"
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    const feedback = JSON.parse(text);
    return Response.json(feedback);
  } catch {
    return Response.json({ error: 'Failed to parse feedback' }, { status: 500 });
  }
}
