const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com';

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
  const apiKey = process.env.JUDGE0_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: 'Code execution is not configured. Add JUDGE0_API_KEY to .env.local to enable it.' },
      { status: 503 }
    );
  }

  const { code, language, stdin } = await request.json();

  if (!code || !language) {
    return Response.json({ error: 'Missing code or language' }, { status: 400 });
  }

  const languageId = LANGUAGE_TO_JUDGE0[String(language).toLowerCase()];
  if (!languageId) {
    return Response.json({ error: `Unsupported language: ${language}` }, { status: 400 });
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
      body: JSON.stringify({
        source_code: code,
        language_id: languageId,
        stdin: stdin ?? '',
      }),
    });

    if (!submitRes.ok) {
      const text = await submitRes.text();
      return Response.json({ error: `Submission failed: ${text}` }, { status: 502 });
    }

    const submitData = await submitRes.json();
    token = submitData.token;
  } catch (err) {
    return Response.json({ error: `Failed to submit code: ${String(err)}` }, { status: 502 });
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

  return Response.json(result);
}
