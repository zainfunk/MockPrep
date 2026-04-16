import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rateLimit';

const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com';
const MAX_BODY_BYTES = 100_000; // 100 KB — plenty for even large code snippets
const MAX_CODE_LENGTH = 50_000; // 50 KB of source code

const LANGUAGE_TO_JUDGE0: Record<string, number> = {
  python: 71,
  javascript: 63,
  java: 62,
  cpp: 54,
  'c++': 54,
  c: 50,
  typescript: 74,
  go: 60,
  rust: 73,
  ruby: 72,
  csharp: 51,
  'c#': 51,
  kotlin: 78,
  swift: 83,
  php: 68,
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 30 runs per hour, 200 per day per user — covers normal practice with headroom
  const hourly = rateLimit(`run-code:h:${userId}`, 30, 60 * 60 * 1000);
  if (!hourly.ok) {
    return NextResponse.json(
      { error: `Code execution rate limit reached. Try again in ${hourly.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': String(hourly.retryAfter) } }
    );
  }
  const daily = rateLimit(`run-code:d:${userId}`, 200, 24 * 60 * 60 * 1000);
  if (!daily.ok) {
    return NextResponse.json(
      { error: 'Daily code execution quota reached. Try again tomorrow.' },
      { status: 429, headers: { 'Retry-After': String(daily.retryAfter) } }
    );
  }

  const apiKey = process.env.JUDGE0_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Code execution is not configured.' },
      { status: 503 }
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
  }

  let body: { code?: string; language?: string; stdin?: string };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { code, language, stdin } = body;
  if (!code || !language) {
    return NextResponse.json({ error: 'Missing code or language' }, { status: 400 });
  }
  if (typeof code !== 'string' || code.length > MAX_CODE_LENGTH) {
    return NextResponse.json({ error: 'Code too long' }, { status: 413 });
  }
  if (typeof stdin !== 'undefined' && (typeof stdin !== 'string' || stdin.length > 10_000)) {
    return NextResponse.json({ error: 'stdin too long' }, { status: 413 });
  }

  const languageId = LANGUAGE_TO_JUDGE0[String(language).toLowerCase()];
  if (!languageId) {
    return NextResponse.json({ error: `Unsupported language: ${language}` }, { status: 400 });
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
  };

  let token: string;
  try {
    const submitRes = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ source_code: code, language_id: languageId, stdin: stdin ?? '' }),
    });

    if (!submitRes.ok) {
      const text = await submitRes.text();
      return NextResponse.json({ error: `Submission failed: ${text}` }, { status: 502 });
    }

    const submitData = await submitRes.json();
    token = submitData.token;
  } catch (err) {
    return NextResponse.json({ error: `Failed to submit code: ${String(err)}` }, { status: 502 });
  }

  let result: Record<string, unknown> = {};
  for (let i = 0; i < 10; i++) {
    await sleep(1000);
    try {
      const pollRes = await fetch(
        `${JUDGE0_URL}/submissions/${token}?base64_encoded=false&fields=stdout,stderr,compile_output,status,time,memory`,
        { headers }
      );
      result = await pollRes.json();
      const statusId = (result.status as { id: number } | undefined)?.id ?? 0;
      if (statusId > 2) break;
    } catch {
      // keep polling
    }
  }

  return NextResponse.json(result);
}
