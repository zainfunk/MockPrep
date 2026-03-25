import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

interface PromptEvent {
  userMessage: string;
  aiResponse: string;
  timestamp: number;
}

export async function POST(request: Request) {
  const {
    problemTitle,
    problemDescription,
    promptEvents,
    finalCode,
    lastAiCodeBlock,
    ranCode,
    codeMatchesAI,
    codeModifiedFromAI,
    promptCount,
    duration,
  } = await request.json();

  const conversationText = (promptEvents as PromptEvent[])
    .map(
      (e, i) =>
        `[Prompt ${i + 1}]\nUser: ${e.userMessage}\n\nAI: ${e.aiResponse}`
    )
    .join('\n\n---\n\n');

  const codeComparisonNote = codeMatchesAI
    ? "The user submitted the AI's code verbatim without any modifications."
    : codeModifiedFromAI
    ? "The user modified the AI's code before submitting."
    : lastAiCodeBlock
    ? 'The AI produced code but the user wrote their own final solution.'
    : 'No AI-generated code was produced during this session.';

  const prompt = `You are evaluating a developer's GenAI Coding — how well they use AI tools to solve a programming problem. Analyze the interaction below and provide structured feedback.

Problem: ${problemTitle}
${problemDescription ? `\nProblem description:\n${problemDescription}` : ''}

Session stats:
- Duration: ${duration}
- Total prompts sent: ${promptCount}
- Ran code to test it: ${ranCode ? 'Yes' : 'No'}
- Code submission: ${codeComparisonNote}

Full interaction transcript:
${conversationText || '(No prompts were sent)'}

Final submitted code:
\`\`\`
${finalCode || '(No code submitted)'}
\`\`\`

Evaluate on 4 dimensions, scoring each 1-5:

1. **Prompt Quality** (1-5): Were prompts specific and well-contextualized? Did the user iterate and refine their requests? Did they provide useful context? High score = precise, purposeful prompting with good follow-up.

2. **Output Validation** (1-5): Did the user run the code to test it? Did they check edge cases or question AI outputs? Did they probe for errors? High score = actively verifying rather than blindly accepting.

3. **Human Judgment** (1-5): Did the user push back on AI suggestions, make independent edits, or customize the AI's code? Or did they wholesale accept every response? High score = exercising genuine judgment, not just rubber-stamping.

4. **Accountability** (1-5): Does the evidence suggest the user understands what they submitted? Did they ask clarifying questions about the code? Did they engage with explanations? High score = clear ownership and understanding.

Fluency level mapping (based on average score):
- 4.5-5.0 = "Strength"
- 3.5-4.4 = "Mild Strength"
- 2.5-3.4 = "Mixed"
- 1.5-2.4 = "Mild Concern"
- 1.0-1.4 = "Concern"

Return a JSON object with exactly this structure (no markdown, raw JSON only):
{
  "promptQualityScore": <1-5 integer>,
  "promptQualityExplanation": "<2-3 sentence explanation citing specific evidence>",
  "outputValidationScore": <1-5 integer>,
  "outputValidationExplanation": "<2-3 sentence explanation>",
  "humanJudgmentScore": <1-5 integer>,
  "humanJudgmentExplanation": "<2-3 sentence explanation>",
  "accountabilityScore": <1-5 integer>,
  "accountabilityExplanation": "<2-3 sentence explanation>",
  "fluencyLevel": "<one of: Concern, Mild Concern, Mixed, Mild Strength, Strength>",
  "averageScore": <float to 1 decimal>,
  "keyMoments": ["<specific moment 1>", "<specific moment 2>", "<specific moment 3>"],
  "topImprovements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "closingNote": "<1-2 sentence encouraging, honest closing note>"
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const text =
    response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
    const feedback = JSON.parse(cleaned);
    return Response.json(feedback);
  } catch {
    return Response.json({ error: 'Failed to generate feedback. Please try again.' }, { status: 500 });
  }
}
