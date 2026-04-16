import Anthropic from '@anthropic-ai/sdk';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

const client = new Anthropic();
const MAX_BODY_BYTES = 200_000;

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rl = rateLimit(`chat:${userId}`, 60, 60 * 60 * 1000); // 60 calls/hour
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Chat rate limit reached. Try again in ${rl.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } }
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

  let body: { messages?: unknown; problemTitle?: string; problemDescription?: string; code?: string; language?: string };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { messages, problemTitle, problemDescription, code, language } = body;

  if (!Array.isArray(messages) || typeof problemTitle !== 'string' || typeof problemDescription !== 'string') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const codeSection = code?.trim()
    ? `\nCandidate's current code (${language ?? 'unknown'}):\n\`\`\`${language ?? ''}\n${code}\n\`\`\`\nUse this to inform your guidance. Don't explicitly mention you can see their code unless they bring it up or it's directly relevant.\n`
    : '';

  const systemPrompt = `You are a professional but approachable technical interviewer at a top tech company conducting a coding interview. Your role is to guide the candidate through solving "${problemTitle}" using the Socratic method.

Problem being solved:
${problemDescription}
${codeSection}
Guidelines:
- Open the session by introducing yourself briefly and asking the candidate to read the problem and share their initial approach/thoughts
- Ask targeted follow-up questions like "What's the time complexity of that approach?", "Can you think of any edge cases?", "What data structure might help here?"
- When the candidate is stuck, give small, directional hints — never the full solution
- Praise good insights genuinely but briefly
- Track struggles mentally and note them for feedback later
- Keep responses concise (2-4 sentences typically) — this is a conversation, not a lecture
- If the candidate asks you to just give them the answer, decline kindly and offer a smaller hint instead
- Be encouraging and create a low-pressure environment`;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages as Anthropic.MessageParam[],
        stream: true,
      });

      for await (const event of response) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
