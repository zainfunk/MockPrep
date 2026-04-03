import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

interface QuestionInput {
  question: string;
  category: string;
  response: string;
}

const CRITERIA = [
  'specificity',
  'genaiLiteracy',
  'criticalThinking',
  'judgment',
  'responsibility',
  'learningAgility',
  'communication',
] as const;

const CRITERIA_LABELS: Record<(typeof CRITERIA)[number], string> = {
  specificity: 'Specificity & Concreteness',
  genaiLiteracy: 'GenAI Literacy',
  criticalThinking: 'Critical Thinking & Evaluation',
  judgment: 'Judgment & Risk Awareness',
  responsibility: 'Responsibility & Ethics',
  learningAgility: 'Learning Agility',
  communication: 'Communication & Influence',
};

const RED_FLAG_LIST = [
  'Candidate has never used a GenAI tool in a real work or personal context',
  'Candidate shows no awareness that GenAI can produce inaccurate or misleading output',
  'Candidate has never considered data privacy when using GenAI tools',
  'Candidate describes using GenAI to generate work submitted as their own without any review',
  'Candidate expresses blanket refusal to use GenAI tools without a reasoned explanation',
];

function ratingFromScore(score: number): string {
  if (score >= 24) return 'Exceptional';
  if (score >= 18) return 'Proficient';
  if (score >= 11) return 'Developing';
  return 'Insufficient';
}

export async function POST(request: Request) {
  const { questions, duration } = (await request.json()) as {
    questions: QuestionInput[];
    duration: number;
  };

  const questionsText = questions
    .map(
      (q, i) =>
        `--- Question ${i + 1} [${q.category}] ---\nQuestion: ${q.question}\n\nCandidate Response:\n${q.response || '(No response provided)'}`
    )
    .join('\n\n');

  const criteriaDesc = Object.entries(CRITERIA_LABELS)
    .map(([key, label]) => `- ${label} (key: "${key}"): scored 1–4`)
    .join('\n');

  const prompt = `You are an expert evaluator conducting a GenAI Fluency behavioral interview assessment. You will evaluate ${questions.length} candidate responses using a strict 7-criterion rubric.

Session duration: ${Math.round(duration / 60)} minutes

${questionsText}

---

EVALUATION RUBRIC — score each criterion 1–4 per question:

1. Specificity & Concreteness (specificity):
   4 = Names specific tool, task, project, outcome — vivid and verifiable
   3 = Mostly specific but missing one key detail (no outcome, or vague on tool)
   2 = Generic — could apply to almost anyone, tool/context unnamed or unclear
   1 = No real example — responds with how they "would" rather than what they did

2. GenAI Literacy (genaiLiteracy):
   4 = Clear understanding of what the tool does and why — aware of hallucinations, prompt sensitivity, variability
   3 = Practical-level understanding but no deeper technical awareness
   2 = Uses GenAI tools but treats them as black boxes
   1 = Demonstrates misconceptions, or conflates GenAI with traditional software

3. Critical Thinking & Evaluation (criticalThinking):
   4 = Built or described a clear review process — caught errors proactively, iterates based on quality
   3 = Reviews output but process is informal or inconsistent
   2 = Accepts GenAI output with minimal review, relies on gut feeling
   1 = No evidence of evaluating outputs — takes AI content at face value

4. Judgment & Risk Awareness (judgment):
   4 = Clearly articulates decision criteria, has examples of choosing NOT to use GenAI, thinks about downstream risk
   3 = Aware of risks but applies judgment reactively not proactively
   2 = Uses GenAI broadly without much consideration for appropriateness
   1 = No evidence of considering risk — views GenAI as a default solution

5. Responsibility & Ethics (responsibility):
   4 = Proactively considered data privacy, bias, IP, compliance, or human accountability with concrete examples
   3 = Aware of ethical considerations but relies on org policy rather than personal judgment
   2 = Mentions ethics only when prompted — no concrete responsible decision-making examples
   1 = No awareness of ethical or compliance concerns

6. Learning Agility (learningAgility):
   4 = Describes deliberate experimentation, iteration, and learning from GenAI failures — skills clearly evolving
   3 = Has improved approach over time but growth is passive (learned from mistakes not proactive exploration)
   2 = Uses GenAI the same way they started — little evidence of learning
   1 = No evidence of growth or curiosity about GenAI capabilities

7. Communication & Influence (communication):
   4 = Calibrates message to different audiences (technical vs non-technical, enthusiastic vs skeptical) — has influenced others
   3 = Communicates clearly about GenAI but hasn't navigated significant resistance or complexity
   2 = Can explain what they did but struggles to articulate why or tailor for stakeholders
   1 = Communication is unclear, jargon-heavy, or unable to translate GenAI concepts

RED FLAGS — check if any apply across all responses:
${RED_FLAG_LIST.map((f, i) => `RF${i + 1}: ${f}`).join('\n')}

Return a JSON object with EXACTLY this structure (no markdown, raw JSON only):
{
  "questionResults": [
    {
      "scores": {
        "specificity": <1-4>,
        "genaiLiteracy": <1-4>,
        "criticalThinking": <1-4>,
        "judgment": <1-4>,
        "responsibility": <1-4>,
        "learningAgility": <1-4>,
        "communication": <1-4>
      },
      "totalScore": <7-28>,
      "notes": "<2-3 sentence specific evaluation of this response citing evidence>"
    }
  ],
  "aggregateScores": {
    "specificity": <float 1-4, average across questions>,
    "genaiLiteracy": <float 1-4>,
    "criticalThinking": <float 1-4>,
    "judgment": <float 1-4>,
    "responsibility": <float 1-4>,
    "learningAgility": <float 1-4>,
    "communication": <float 1-4>
  },
  "totalScore": <sum of all question totalScores>,
  "rating": "<Exceptional|Proficient|Developing|Insufficient based on average question score>",
  "redFlagsPresent": [<list of RF numbers that apply, e.g. "RF1", "RF3">],
  "redFlagDetails": ["<description of each red flag found>"],
  "keyStrengths": ["<strength 1>", "<strength 2>"],
  "keyImprovements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "closingNote": "<1-2 sentence honest, encouraging closing note>"
}`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    const cleaned = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
    const feedback = JSON.parse(cleaned);

    // Ensure rating is derived correctly from average question score
    const avgQuestionScore = feedback.totalScore / questions.length;
    feedback.rating = ratingFromScore(Math.round(avgQuestionScore));
    feedback.hasRedFlags = (feedback.redFlagsPresent ?? []).length > 0;

    return Response.json(feedback);
  } catch {
    return Response.json({ error: 'Failed to generate feedback. Please try again.' }, { status: 500 });
  }
}
