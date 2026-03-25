import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/sessions — fetch all sessions for the current user
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [interviewRes, genaiRes, fluencyRes] = await Promise.all([
    supabase
      .from('interview_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('genai_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('fluency_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
  ]);

  return NextResponse.json({
    interviewSessions: interviewRes.data ?? [],
    genaiSessions: genaiRes.data ?? [],
    fluencySessions: fluencyRes.data ?? [],
  });
}

// POST /api/sessions — save a session for the current user
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { type, session } = body as { type: 'interview' | 'genai' | 'fluency'; session: Record<string, unknown> };

  if (type === 'interview') {
    const { error } = await supabase.from('interview_sessions').insert({
      user_id: userId,
      problem_title: session.problemTitle,
      difficulty: session.difficulty,
      category: session.category,
      duration: session.duration,
      score_communication: (session.scores as Record<string, number>).communication,
      score_problem_solving: (session.scores as Record<string, number>).problemSolving,
      score_code_quality: (session.scores as Record<string, number>).codeQuality,
      overall_score: session.overallScore,
      top_improvements: session.topImprovements,
      full_feedback: session.fullFeedback,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (type === 'genai') {
    const { error } = await supabase.from('genai_sessions').insert({
      user_id: userId,
      problem_id: session.problemId,
      problem_title: session.problemTitle,
      difficulty: session.difficulty,
      category: session.category,
      duration: session.duration,
      prompt_count: session.promptCount,
      ran_code: session.ranCode,
      code_matches_ai: session.codeMatchesAI,
      code_modified_from_ai: session.codeModifiedFromAI,
      score_prompt_quality: (session.scores as Record<string, number>).promptQuality,
      score_output_validation: (session.scores as Record<string, number>).outputValidation,
      score_human_judgment: (session.scores as Record<string, number>).humanJudgment,
      score_accountability: (session.scores as Record<string, number>).accountability,
      fluency_level: session.fluencyLevel,
      average_score: session.averageScore,
      key_moments: session.keyMoments,
      top_improvements: session.topImprovements,
      closing_note: session.closingNote,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (type === 'fluency') {
    const { error } = await supabase.from('fluency_sessions').insert({
      user_id: userId,
      duration: session.duration,
      total_score: session.totalScore,
      rating: session.rating,
      has_red_flags: session.hasRedFlags,
      red_flag_details: session.redFlagDetails,
      aggregate_scores: session.aggregateScores,
      question_results: session.questionResults,
      questions: session.questions,
      key_strengths: session.keyStrengths,
      key_improvements: session.keyImprovements,
      closing_note: session.closingNote,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
