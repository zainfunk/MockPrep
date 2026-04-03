import { getGenAIProblemById, genaiProblems } from '@/lib/genaiProblems';
import { notFound } from 'next/navigation';
import GenAISession from '@/components/GenAISession';

export function generateStaticParams() {
  return genaiProblems.map((p) => ({ problemId: p.id }));
}

export default async function GenAIPage({
  params,
}: {
  params: Promise<{ problemId: string }>;
}) {
  const { problemId } = await params;
  const problem = getGenAIProblemById(problemId);
  if (!problem) notFound();

  return <GenAISession problem={problem} />;
}
