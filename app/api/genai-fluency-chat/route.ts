import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request) {
  const { question, category, history, message } = (await request.json()) as {
    question: string;
    category: string;
    history: ChatMessage[];
    message: string;
  };

  const systemPrompt = `You are a helpful interview coach assistant for a GenAI Fluency behavioral assessment. The candidate is currently answering this interview question:

Category: ${category}
Question: "${question}"

The assessment evaluates candidates on 7 criteria:
1. Specificity & Concreteness — naming specific tools, tasks, projects, and measurable outcomes
2. GenAI Literacy — understanding how GenAI works, hallucinations, prompt sensitivity, model variability
3. Critical Thinking & Evaluation — review processes for verifying and improving GenAI outputs
4. Judgment & Risk Awareness — when to and not to use GenAI, considering downstream risks
5. Responsibility & Ethics — data privacy, bias, IP, compliance, and accountability concerns
6. Learning Agility — deliberate experimentation and growth with GenAI over time
7. Communication & Influence — explaining GenAI concepts to different audiences and navigating skepticism

Your role is to help the candidate understand the question better, clarify what strong answers look like, or explain GenAI concepts relevant to the question and criteria. Do NOT write the answer for them or give them a script to recite. Keep responses concise (2-4 sentences). Be encouraging but honest. Always tie your answer back to this specific question and the assessment criteria.`;

  const messages: ChatMessage[] = [
    ...history,
    { role: 'user', content: message },
  ];

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system: systemPrompt,
    messages,
  });

  const reply = response.content[0].type === 'text' ? response.content[0].text : '';
  return Response.json({ reply });
}
