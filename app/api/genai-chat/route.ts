import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(request: Request) {
  const { messages, problemTitle, problemDescription } = await request.json();

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
