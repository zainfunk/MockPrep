import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { problems } from '@/data/problems';
import { genaiProblems } from '@/data/genaiProblems';
import { loadUserState } from '@/lib/subscription';

interface CatalogProblem {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  description: string;
  companies?: string[];
}

interface CatalogGenAI {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  description: string;
}

export async function GET() {
  const { userId } = await auth();

  let canUseCompanyFilter = false;
  if (userId) {
    try {
      const state = await loadUserState(userId);
      canUseCompanyFilter = state.unlimited || state.tier === 'pro';
    } catch {
      canUseCompanyFilter = false;
    }
  }

  const coding: CatalogProblem[] = problems.map((p) => {
    const base: CatalogProblem = {
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      category: p.category,
      description: p.description,
    };
    if (canUseCompanyFilter && p.companies) base.companies = p.companies;
    return base;
  });

  const genai: CatalogGenAI[] = genaiProblems.map((p) => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    category: p.category,
    description: p.description,
  }));

  return NextResponse.json({ coding, genai, canUseCompanyFilter });
}
