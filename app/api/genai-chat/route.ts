import Anthropic from '@anthropic-ai/sdk';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

const client = new Anthropic();
const MAX_BODY_BYTES = 200_000;

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rl = rateLimit(`genai-chat:${userId}`, 60, 60 * 60 * 1000);
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

  let body: { messages?: unknown; problemTitle?: string; problemDescription?: string };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { messages, problemTitle, problemDescription } = body;

  if (!Array.isArray(messages) || typeof problemTitle !== 'string' || typeof problemDescription !== 'string') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const systemPrompt = `You are a helpful AI programming assistant. The user is working on a coding problem called "${problemTitle}".

Problem description:
${problemDescription}

Guidelines:
- Be genuinely helpful — write code when asked, explain approaches clearly, and modify code on request
- When you write code, always put it in a fenced code block (e.g. \`\`\`python ... \`\`\`)
- Every fenced code block you produce is rendered in the UI with an "Insert into Editor" button. Clicking it replaces the contents of the candidate's IDE with that code block. Reference this capability in your wording — e.g. "Here's a solution you can insert into the editor", "Hit Insert to drop this into your IDE", "Use the Insert button to load this", etc. NEVER tell the user to "copy and paste", "paste this in", or manually transfer the code — the button does that for them.
- If asked to write a solution, write a complete, working implementation
- Explain your reasoning so the user can learn from it
- If the user's code has a bug, point it out and show a fix
- Keep responses concise and focused — this is a pair-programming session, not a lecture
- You can suggest improvements or alternative approaches, but always answer the question asked first`;

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
