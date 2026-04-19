import { getProblemById, problems } from '@/lib/problems';
import { notFound } from 'next/navigation';
import InterviewSession from '@/components/InterviewSession';

export function generateStaticParams() {
  return problems.map((p) => ({ problemId: p.id }));
}

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ problemId: string }>;
}) {
  const { problemId } = await params;
  const problem = getProblemById(problemId);
  if (!problem) notFound();

  // Never ship company tags to the client — they're a Pro-gated dimension
  // exposed only through /api/problems/catalog for Pro accounts.
  const { companies: _omit, ...safeProblem } = problem;
  void _omit;
  return <InterviewSession problem={safeProblem} />;
}
