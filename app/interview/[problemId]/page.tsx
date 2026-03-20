import { getProblemById, problems } from '@/lib/problems';
import { notFound } from 'next/navigation';
import InterviewSession from '@/components/InterviewSession';

export function generateStaticParams() {
  return problems.map((p) => ({ problemId: p.id }));
}

export default function InterviewPage({
  params,
}: {
  params: { problemId: string };
}) {
  const problem = getProblemById(params.problemId);
  if (!problem) notFound();

  return <InterviewSession problem={problem} />;
}
