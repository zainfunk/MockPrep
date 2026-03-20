import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(request: Request) {
  const { messages, problemTitle, problemDescription } = await request.json();

  const systemPrompt = `You are a professional but approachable technical interviewer at a top tech company conducting a coding interview. Your role is to guide the candidate through solving "${problemTitle}" using the Socratic method.

Problem being solved:
${problemDescription}

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
        messages: messages,
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
