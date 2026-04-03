export interface FluencyQuestion {
  id: string;
  category: string;
  question: string;
}

export const fluencyQuestions: FluencyQuestion[] = [
  // ── Identifying Opportunities & Use Cases ──────────────────────────────────
  {
    id: 'opp-1',
    category: 'Identifying Opportunities & Use Cases',
    question:
      `Tell me about a time when you identified a repetitive task in your work that you successfully automated or accelerated using a GenAI tool. What made you realize GenAI was the right fit for that task? How did you test whether it was actually saving time or improving quality? What would you do differently now?`,
  },
  {
    id: 'opp-2',
    category: 'Identifying Opportunities & Use Cases',
    question:
      `Describe a situation where you experimented with multiple GenAI tools to solve the same problem before settling on one. What criteria did you use to compare them? How did you structure your evaluation? What did that process teach you about matching tools to use cases?`,
  },
  {
    id: 'opp-3',
    category: 'Identifying Opportunities & Use Cases',
    question:
      `Tell me about a time when you saw a colleague struggling with something and suggested a GenAI approach they hadn't considered. How did you introduce the idea without overcomplicating it? Did it work out, and what did that experience teach you about advocating for new tools?`,
  },
  {
    id: 'opp-4',
    category: 'Identifying Opportunities & Use Cases',
    question:
      `Describe a time when you used GenAI to help you work in an area outside your core expertise. How did you validate that the output was accurate enough to use? What guardrails did you put in place, and what did you learn about the limits of that approach?`,
  },
  {
    id: 'opp-5',
    category: 'Identifying Opportunities & Use Cases',
    question:
      `Tell me about a time when a GenAI use case you proposed didn\'t get approved or adopted. What objections did you face? How did you respond to them, and what would you do differently to build the case next time?`,
  },
  {
    id: 'opp-6',
    category: 'Identifying Opportunities & Use Cases',
    question:
      `Describe a situation where you used GenAI to speed up a creative or strategic task, not just an operational one. How did you use the output — as a starting point, a sounding board, or something else? What did working that way reveal about how GenAI fits into higher-order thinking?`,
  },

  // ── Critical Evaluation of GenAI Output ───────────────────────────────────
  {
    id: 'eval-1',
    category: 'Critical Evaluation of GenAI Output',
    question:
      `Tell me about a time when GenAI produced output that looked polished but contained a significant error or hallucination. What tipped you off that something was wrong? Did you catch it before it caused a problem, and how has that experience shaped the way you review AI-generated content?`,
  },
  {
    id: 'eval-2',
    category: 'Critical Evaluation of GenAI Output',
    question:
      `Describe a situation where you had to fact-check or verify GenAI output before using it in something important. What made you suspicious in the first place? What verification methods did you use, and how do you now build that into your regular workflow?`,
  },
  {
    id: 'eval-3',
    category: 'Critical Evaluation of GenAI Output',
    question:
      `Tell me about a time when you received GenAI output that was technically correct but not actually useful for your specific context. What was missing? How did you refine your approach to get something more targeted, and what did you learn about prompting?`,
  },
  {
    id: 'eval-4',
    category: 'Critical Evaluation of GenAI Output',
    question:
      `Describe a time when you had to evaluate whether a GenAI tool\'s output met a quality bar set by your organization or client. How did you define that bar? What did the evaluation process look like, and how has your approach to quality assessment evolved?`,
  },
  {
    id: 'eval-5',
    category: 'Critical Evaluation of GenAI Output',
    question:
      `Tell me about a time when you used GenAI output as a first draft and had to significantly rewrite it. What specifically needed to change? How did you balance preserving what was useful with fixing what wasn\'t, and what techniques did you develop to get better first drafts over time?`,
  },
  {
    id: 'eval-6',
    category: 'Critical Evaluation of GenAI Output',
    question:
      `Describe a situation where you developed a systematic process for reviewing GenAI outputs on your team. What quality issues prompted you to create it? How did you make the criteria clear enough for others to apply consistently?`,
  },

  // ── Human Oversight & Accountability ──────────────────────────────────────
  {
    id: 'oversight-1',
    category: 'Human Oversight & Accountability',
    question:
      `Tell me about a time when you had to determine how much of a task to hand off to a GenAI tool versus keeping humans in control. What factors influenced that decision? How did you design the process to ensure accountability wasn\'t lost?`,
  },
  {
    id: 'oversight-2',
    category: 'Human Oversight & Accountability',
    question:
      `Describe a situation where a GenAI-assisted process produced an unintended outcome that affected others. How did you detect it? What did you change about the process, and what did you learn about responsible deployment?`,
  },
  {
    id: 'oversight-3',
    category: 'Human Oversight & Accountability',
    question:
      `Tell me about a time when you implemented a GenAI solution and had to build in monitoring or review checkpoints to catch problems before they escalated. What risks were you guarding against? How did those safeguards hold up in practice?`,
  },
  {
    id: 'oversight-4',
    category: 'Human Oversight & Accountability',
    question:
      `Describe a time when you pushed back on using GenAI in a way that would have reduced appropriate human oversight. What were the specific risks you were concerned about? How did you make the case for a more cautious approach?`,
  },
  {
    id: 'oversight-5',
    category: 'Human Oversight & Accountability',
    question:
      `Tell me about a time when you had to ensure that work produced with GenAI assistance was still attributable and accountable to a specific person or team. How did you structure that? What challenges came up, and how did you resolve them?`,
  },
  {
    id: 'oversight-6',
    category: 'Human Oversight & Accountability',
    question:
      `Describe a situation where you recognized that a GenAI tool was introducing bias or inconsistency into outputs. How did you identify it? What steps did you take to correct it, and how did that experience change how you vet tools going forward?`,
  },

  // ── Ethics, Compliance & Sensitive Information ────────────────────────────
  {
    id: 'ethics-1',
    category: 'Ethics, Compliance & Sensitive Information',
    question:
      `Tell me about a time when you decided not to use a GenAI tool for a task because of data privacy or confidentiality concerns. What specific risks led you to that decision? How did you evaluate which tools were and weren\'t appropriate for that type of data?`,
  },
  {
    id: 'ethics-2',
    category: 'Ethics, Compliance & Sensitive Information',
    question:
      `Describe a situation where you had to establish or enforce guidelines around what types of information could and couldn\'t be entered into a GenAI tool. What prompted the need for those guidelines? How did you communicate and implement them?`,
  },
  {
    id: 'ethics-3',
    category: 'Ethics, Compliance & Sensitive Information',
    question:
      `Tell me about a time when you had to decide against using GenAI for a task due to ethical, legal, or compliance concerns. How did you weigh the potential benefits against the risks? What alternative approach did you use instead?`,
  },
  {
    id: 'ethics-4',
    category: 'Ethics, Compliance & Sensitive Information',
    question:
      `Describe a time when you discovered that someone on your team was using a GenAI tool in a way that posed a compliance or security risk. How did you handle it? What systemic changes did you put in place to prevent it from happening again?`,
  },
  {
    id: 'ethics-5',
    category: 'Ethics, Compliance & Sensitive Information',
    question:
      `Tell me about a time when you used GenAI to handle information that required extra care. What precautions did you take before, during, and after? How did you evaluate whether the tool you chose was appropriate for that sensitivity level?`,
  },
  {
    id: 'ethics-6',
    category: 'Ethics, Compliance & Sensitive Information',
    question:
      `Describe a situation where intellectual property or copyright considerations affected how you used GenAI output. How did you identify the concern? What guidelines did you follow or create to address it?`,
  },

  // ── Stakeholder Communication & Influence ─────────────────────────────────
  {
    id: 'comms-1',
    category: 'Stakeholder Communication & Influence',
    question:
      `Tell me about a time when you had to communicate the risks of a GenAI solution to stakeholders who were enthusiastic and eager to move fast. What specific concerns did you raise? How did you balance honesty about limitations with not discouraging innovation?`,
  },
  {
    id: 'comms-2',
    category: 'Stakeholder Communication & Influence',
    question:
      `Describe a situation where you had to convince a skeptical stakeholder or team to try a GenAI approach. What objections did you face? What evidence or framing finally moved them, and what did that experience teach you about driving adoption?`,
  },
  {
    id: 'comms-3',
    category: 'Stakeholder Communication & Influence',
    question:
      `Tell me about a time when you had to explain a GenAI failure or unexpected output to a stakeholder or client. How did you frame what happened? What did you commit to changing, and how did the relationship hold up?`,
  },
  {
    id: 'comms-4',
    category: 'Stakeholder Communication & Influence',
    question:
      `Describe a time when you had to develop and present a GenAI strategy or roadmap to leadership or a broader team. How did you assess readiness and prioritize initiatives? How did you balance ambition with realistic constraints?`,
  },
  {
    id: 'comms-5',
    category: 'Stakeholder Communication & Influence',
    question:
      `Tell me about a time when you coached or trained others on how to evaluate and refine GenAI outputs effectively. What misconceptions did you have to address first? How did you structure your guidance so people could become self-sufficient?`,
  },
  {
    id: 'comms-6',
    category: 'Stakeholder Communication & Influence',
    question:
      `Describe a situation where you had to set realistic expectations with stakeholders about what a GenAI tool could and couldn\'t do. What led to the misalignment in the first place? How did you recalibrate without damaging confidence in the initiative?`,
  },

  // ── Learning, Adaptation & Experimentation ────────────────────────────────
  {
    id: 'learning-1',
    category: 'Learning, Adaptation & Experimentation',
    question:
      `Tell me about a time when you had to rapidly learn a new GenAI capability or tool to solve a pressing problem. How did you go about understanding it quickly? How did you validate that you understood it well enough to use it reliably?`,
  },
  {
    id: 'learning-2',
    category: 'Learning, Adaptation & Experimentation',
    question:
      `Describe a situation where a GenAI tool you had been relying on stopped being effective or was superseded by something better. What prompted you to reassess? How did you evaluate and transition to a new approach?`,
  },
  {
    id: 'learning-3',
    category: 'Learning, Adaptation & Experimentation',
    question:
      `Tell me about a time when you significantly improved your results with a GenAI tool by changing how you prompted or interacted with it. What wasn\'t working before? What specifically did you change, and how did you arrive at the better approach?`,
  },
  {
    id: 'learning-4',
    category: 'Learning, Adaptation & Experimentation',
    question:
      `Describe a time when you ran a structured experiment to test whether a GenAI approach would actually outperform your existing process. How did you design the test? What did the results show, and how did you act on them?`,
  },
  {
    id: 'learning-5',
    category: 'Learning, Adaptation & Experimentation',
    question:
      `Tell me about a time when you used GenAI for a personal productivity challenge. What were you trying to solve? How did you experiment to find what worked, and what did you learn about which types of tasks benefit most from AI assistance?`,
  },

  // ── Judgment & Knowing When Not to Use GenAI ──────────────────────────────
  {
    id: 'judgment-1',
    category: 'Judgment & Knowing When Not to Use GenAI',
    question:
      `Tell me about a time when you realized mid-project that GenAI was not the right solution for what you were trying to accomplish. What made that clear? How did you pivot, and what did you learn about where GenAI\'s limitations actually lie?`,
  },
  {
    id: 'judgment-2',
    category: 'Judgment & Knowing When Not to Use GenAI',
    question:
      `Describe a situation where you chose a non-AI approach over a GenAI one, even though GenAI seemed like the obvious choice. What factors led you to that conclusion? How did it turn out, and would you make the same call again?`,
  },
  {
    id: 'judgment-3',
    category: 'Judgment & Knowing When Not to Use GenAI',
    question:
      `Tell me about a time when the cost, complexity, or unreliability of a GenAI solution made it not worth pursuing. How did you arrive at that assessment? What trade-offs were you weighing, and how did stakeholders respond?`,
  },
  {
    id: 'judgment-4',
    category: 'Judgment & Knowing When Not to Use GenAI',
    question:
      `Describe a time when you had to help your team resist the temptation to use GenAI just because it was available, rather than because it was the best tool. What was the situation? How did you frame the decision, and what criteria did you use to guide the team?`,
  },
  {
    id: 'judgment-5',
    category: 'Judgment & Knowing When Not to Use GenAI',
    question:
      `Tell me about a time when using GenAI created more work than it saved, at least initially. What caused that? What adjustments did you make, and at what point — if ever — did it become worthwhile?`,
  },
];

export const FLUENCY_CATEGORIES = [
  'Identifying Opportunities & Use Cases',
  'Critical Evaluation of GenAI Output',
  'Human Oversight & Accountability',
  'Ethics, Compliance & Sensitive Information',
  'Stakeholder Communication & Influence',
  'Learning, Adaptation & Experimentation',
  'Judgment & Knowing When Not to Use GenAI',
] as const;

export function getRandomFluencyQuestions(count = 3): FluencyQuestion[] {
  const shuffled = [...fluencyQuestions].sort(() => Math.random() - 0.5);
  // Try to pick from different categories
  const selected: FluencyQuestion[] = [];
  const usedCategories = new Set<string>();
  for (const q of shuffled) {
    if (selected.length >= count) break;
    if (!usedCategories.has(q.category)) {
      selected.push(q);
      usedCategories.add(q.category);
    }
  }
  // Fill remaining slots if needed
  for (const q of shuffled) {
    if (selected.length >= count) break;
    if (!selected.includes(q)) selected.push(q);
  }
  return selected;
}
