'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth, SignInButton, useUser } from '@clerk/nextjs';

// ─── Types ────────────────────────────────────────────────────────────────────
interface SessionRecord {
  id: string; date: string; problemTitle: string; difficulty: string; category: string;
  duration: string;
  scores: { communication: number; problemSolving: number; codeQuality: number };
  overallScore: number; topImprovements: string[]; fullFeedback: string;
}
interface GenAISessionRecord {
  id: string; date: string; problemId: string; problemTitle: string; difficulty: string;
  category: string; duration: number; promptCount: number; ranCode: boolean;
  codeMatchesAI: boolean; codeModifiedFromAI: boolean;
  scores: { promptQuality: number; outputValidation: number; humanJudgment: number; accountability: number };
  fluencyLevel: string; averageScore: number; keyMoments: string[]; topImprovements: string[]; closingNote: string;
}
interface FluencySessionRecord {
  id: string; date: string; duration: number; totalScore: number; rating: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseDurationToSeconds(duration: string | number): number {
  if (typeof duration === 'number') return duration;
  if (!duration) return 0;
  const minuteWord = duration.match(/(\d+)\s+minute/);
  if (minuteWord) return parseInt(minuteWord[1]) * 60;
  if (duration.includes('< 1')) return 30;
  const m = duration.match(/(\d+)m/);
  const s = duration.match(/(\d+)s/);
  if (m || s) return (m ? parseInt(m[1]) : 0) * 60 + (s ? parseInt(s[1]) : 0);
  const colon = duration.match(/^(\d+):(\d+)$/);
  if (colon) return parseInt(colon[1]) * 60 + parseInt(colon[2]);
  const num = duration.match(/^(\d+)$/);
  if (num) return parseInt(num[1]) * 60;
  return 0;
}
function formatDuration(secs: number): string {
  if (!secs) return '0m';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  surface:      '#0e0e0f',
  surfaceLow:   '#131314',
  surfaceMid:   '#1a191b',
  surfaceHigh:  '#201f21',
  surfaceTop:   '#262627',
  primary:      '#85adff',
  primaryCont:  '#6e9fff',
  secondary:    '#ac8aff',
  tertiary:     '#9bffce',
  tertiaryDim:  '#58e7ab',
  errorDim:     '#d7383b',
  textPrimary:  '#ffffff',
  textSecond:   '#adaaab',
  textMuted:    '#767576',
  outline:      'rgba(72,72,73,0.15)', // ghost border — 15% only
};

// Typography helper
const type = {
  displayLg:  { fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: '3.5rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.05 },
  headlineMd: { fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: '1.75rem', fontWeight: 500, letterSpacing: '-0.01em' },
  titleSm:    { fontFamily: 'var(--font-inter), sans-serif', fontSize: '1rem', fontWeight: 600 },
  bodyMd:     { fontFamily: 'var(--font-inter), sans-serif', fontSize: '0.875rem', fontWeight: 400 },
  labelMd:    { fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.05em' },
  labelSm:    { fontFamily: 'var(--font-jetbrains-mono), monospace', fontSize: '0.625rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' as const },
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const IcoCode      = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const IcoSparkle   = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>;
const IcoArrow     = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;

// ─── Skill Bar (no rounded ends — technical edge) ─────────────────────────────
function SkillBar({ label, value, maxValue, color }: { label: string; value: number; maxValue: number; color: string }) {
  const pct = Math.min(100, Math.round((value / maxValue) * 100));
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span style={{ ...type.labelSm, color: T.textSecond }}>{label}</span>
        <span style={{ ...type.labelMd, color }}>{value.toFixed(1)}{maxValue === 5 ? '/5' : ''}</span>
      </div>
      {/* No rounded ends — technical edge per spec */}
      <div style={{ height: 3, background: T.surfaceTop, width: '100%' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  );
}

// ─── Activity Calendar ────────────────────────────────────────────────────────
function ActivityCalendar({ activityMap }: { activityMap: Record<string, number> }) {
  const [hovered, setHovered] = useState<{ text: string; x: number; y: number } | null>(null);

  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - 52 * 7);
    const dow = start.getDay();
    start.setDate(start.getDate() + (dow === 0 ? -6 : 1 - dow));
    const weeksArr: { date: Date; count: number; future: boolean }[][] = [];
    const cur = new Date(start);
    while (true) {
      const week: { date: Date; count: number; future: boolean }[] = [];
      for (let d = 0; d < 7; d++) {
        const future = cur > today;
        week.push({ date: new Date(cur), count: future ? 0 : (activityMap[toDateKey(cur)] || 0), future });
        cur.setDate(cur.getDate() + 1);
      }
      weeksArr.push(week);
      if (week.some(day => toDateKey(day.date) === toDateKey(today))) break;
    }
    const labels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeksArr.forEach((week, i) => {
      const month = week[0].date.getMonth();
      if (month !== lastMonth) {
        labels.push({ label: week[0].date.toLocaleDateString('en-US', { month: 'short' }), weekIndex: i });
        lastMonth = month;
      }
    });
    return { weeks: weeksArr, monthLabels: labels };
  }, [activityMap]);

  const CELL = 11, GAP = 3;
  const W = weeks.length * (CELL + GAP);
  const H = 7 * (CELL + GAP) + 18;

  const cellFill = (count: number, future: boolean) => {
    if (future) return 'transparent';
    if (count === 0) return T.surfaceTop;
    if (count === 1) return 'rgba(133,173,255,0.25)';
    if (count === 2) return 'rgba(133,173,255,0.55)';
    return T.primary;
  };

  return (
    <div className="relative overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" style={{ minWidth: Math.min(W, 380) }}>
        {monthLabels.map(({ label, weekIndex }) => (
          <text key={`${label}-${weekIndex}`} x={weekIndex*(CELL+GAP)} y={10}
            fontSize={8} fontFamily="var(--font-jetbrains-mono), monospace" fill={T.textMuted}>{label}</text>
        ))}
        {weeks.map((week, wi) => week.map((day, di) => {
          if (day.future) return null;
          const x = wi*(CELL+GAP), y = 15+di*(CELL+GAP);
          const dateStr = day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const tip = day.count > 0 ? `${dateStr}: ${day.count} session${day.count!==1?'s':''}` : `${dateStr}: no sessions`;
          return (
            <rect key={`${wi}-${di}`} x={x} y={y} width={CELL} height={CELL} rx={1}
              fill={cellFill(day.count, day.future)}
              onMouseEnter={e => setHovered({ text: tip, x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setHovered(null)}
            />
          );
        }))}
      </svg>

      {/* Glassmorphism tooltip — surface-variant @ 60% + 20px backdrop-blur */}
      {hovered && (
        <div className="fixed z-50 pointer-events-none whitespace-nowrap" style={{
          left: hovered.x + 12, top: hovered.y - 38,
          background: 'rgba(38,38,39,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${T.outline}`,
          color: T.textPrimary,
          padding: '5px 11px',
          borderRadius: '0.25rem',
          ...type.labelMd,
        }}>{hovered.text}</div>
      )}

      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span style={{ ...type.labelSm, color: T.textMuted }}>Less</span>
        {[0,1,2,3].map(l => (
          <svg key={l} width={CELL} height={CELL}>
            <rect width={CELL} height={CELL} rx={1}
              fill={l===0?T.surfaceTop:l===1?'rgba(133,173,255,0.25)':l===2?'rgba(133,173,255,0.55)':T.primary}/>
          </svg>
        ))}
        <span style={{ ...type.labelSm, color: T.textMuted }}>More</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user } = useUser();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [genaiSessions, setGenaiSessions] = useState<GenAISessionRecord[]>([]);
  const [fluencySessions, setFluencySessions] = useState<FluencySessionRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!authLoaded) return;

    let localInterviews: SessionRecord[] = [];
    let localGenai: GenAISessionRecord[] = [];
    let localFluency: FluencySessionRecord[] = [];
    try { localInterviews = JSON.parse(localStorage.getItem('interview_sessions') ?? '[]'); } catch {}
    try { localGenai = JSON.parse(localStorage.getItem('genai_sessions') ?? '[]'); } catch {}
    try { localFluency = JSON.parse(localStorage.getItem('fluency_sessions') ?? '[]'); } catch {}

    if (isSignedIn) {
      fetch('/api/sessions').then(r=>r.json()).then(data => {
        const interviews: SessionRecord[] = (data.interviewSessions??[]).map((s: Record<string,unknown>) => ({
          id: s.id as string, date: s.created_at as string,
          problemTitle: s.problem_title as string, difficulty: s.difficulty as string,
          category: s.category as string, duration: s.duration as string,
          scores: { communication: s.score_communication as number, problemSolving: s.score_problem_solving as number, codeQuality: s.score_code_quality as number },
          overallScore: s.overall_score as number, topImprovements: s.top_improvements as string[], fullFeedback: s.full_feedback as string,
        }));
        const genai: GenAISessionRecord[] = (data.genaiSessions??[]).map((s: Record<string,unknown>) => ({
          id: s.id as string, date: s.created_at as string, problemId: s.problem_id as string,
          problemTitle: s.problem_title as string, difficulty: s.difficulty as string, category: s.category as string,
          duration: s.duration as number, promptCount: s.prompt_count as number, ranCode: s.ran_code as boolean,
          codeMatchesAI: s.code_matches_ai as boolean, codeModifiedFromAI: s.code_modified_from_ai as boolean,
          scores: { promptQuality: s.score_prompt_quality as number, outputValidation: s.score_output_validation as number, humanJudgment: s.score_human_judgment as number, accountability: s.score_accountability as number },
          fluencyLevel: s.fluency_level as string, averageScore: s.average_score as number,
          keyMoments: s.key_moments as string[], topImprovements: s.top_improvements as string[], closingNote: s.closing_note as string,
        }));
        const fluency: FluencySessionRecord[] = (data.fluencySessions??[]).map((s: Record<string,unknown>) => ({
          id: s.id as string, date: s.created_at as string, duration: s.duration as number,
          totalScore: s.total_score as number, rating: s.rating as string,
        }));

        // Merge localStorage records not already in Supabase (deduped by id)
        const interviewIds = new Set(interviews.map(s => s.id));
        const genaiIds = new Set(genai.map(s => s.id));
        const fluencyIds = new Set(fluency.map(s => s.id));
        setSessions([...interviews, ...localInterviews.filter(s => !interviewIds.has(s.id))]);
        setGenaiSessions([...genai, ...localGenai.filter(s => !genaiIds.has(s.id))]);
        setFluencySessions([...fluency, ...localFluency.filter(s => !fluencyIds.has(s.id))]);
        setLoaded(true);
      }).catch((err) => {
        console.error('[profile] /api/sessions fetch failed, using localStorage only:', err);
        setSessions(localInterviews);
        setGenaiSessions(localGenai);
        setFluencySessions(localFluency);
        setLoaded(true);
      });
    } else {
      setSessions(localInterviews);
      setGenaiSessions(localGenai);
      setFluencySessions(localFluency);
      setLoaded(true);
    }
  }, [authLoaded, isSignedIn]);

  const stats = useMemo(() => {
    if (!loaded) return null;
    const totalSessions = sessions.length + genaiSessions.length + fluencySessions.length;
    const codingSeconds = sessions.reduce((a,s) => a+parseDurationToSeconds(s.duration), 0);
    const genaiSeconds  = genaiSessions.reduce((a,s) => a+(s.duration||0), 0);
    const avgCodingScore = sessions.length > 0 ? avg(sessions.map(s=>s.overallScore)) : null;
    const bestScore      = sessions.length > 0 ? Math.max(...sessions.map(s=>s.overallScore)) : null;
    const avgGenaiScore  = genaiSessions.length > 0 ? avg(genaiSessions.map(s=>s.averageScore)) : null;

    const activityMap: Record<string,number> = {};
    [...sessions,...genaiSessions,...fluencySessions].forEach(s => { const k=toDateKey(new Date(s.date)); activityMap[k]=(activityMap[k]||0)+1; });

    const today = new Date(); today.setHours(0,0,0,0);
    let currentStreak=0; const d=new Date(today);
    while (activityMap[toDateKey(d)]) { currentStreak++; d.setDate(d.getDate()-1); }

    const sortedDays = Object.keys(activityMap).sort();
    let longestStreak=0, tempStreak=0; let prevDate: Date|null=null;
    for (const ds of sortedDays) {
      const cur=new Date(ds);
      if (prevDate) { const diff=(cur.getTime()-prevDate.getTime())/86400000; tempStreak=diff===1?tempStreak+1:1; } else { tempStreak=1; }
      if (tempStreak>longestStreak) longestStreak=tempStreak;
      prevDate=cur;
    }

    let improvement: number|null=null;
    if (sessions.length>=4) {
      const sorted=[...sessions].sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime());
      const mid=Math.floor(sorted.length/2);
      improvement=avg(sorted.slice(mid).map(s=>s.overallScore))-avg(sorted.slice(0,mid).map(s=>s.overallScore));
    }

    const skillAvg = sessions.length > 0 ? {
      communication: avg(sessions.map(s=>s.scores.communication)),
      problemSolving: avg(sessions.map(s=>s.scores.problemSolving)),
      codeQuality:    avg(sessions.map(s=>s.scores.codeQuality)),
    } : null;

    const genaiSkillAvg = genaiSessions.length > 0 ? {
      promptQuality:    avg(genaiSessions.map(s=>s.scores.promptQuality)),
      outputValidation: avg(genaiSessions.map(s=>s.scores.outputValidation)),
      humanJudgment:    avg(genaiSessions.map(s=>s.scores.humanJudgment)),
      accountability:   avg(genaiSessions.map(s=>s.scores.accountability)),
    } : null;

    const catCount: Record<string,number> = {};
    [...sessions,...genaiSessions].forEach(s => { catCount[s.category]=(catCount[s.category]||0)+1; });
    const topCategories = Object.entries(catCount).sort((a,b)=>b[1]-a[1]).slice(0,5);

    const diffCount: Record<string,number> = { easy:0, medium:0, hard:0 };
    [...sessions,...genaiSessions].forEach(s => { const dk=(s.difficulty||'').toLowerCase(); if (dk in diffCount) diffCount[dk]++; });

    const bestSession = sessions.length > 0 ? [...sessions].sort((a,b)=>b.overallScore-a.overallScore)[0] : null;

    const weekStart = new Date(today); weekStart.setDate(today.getDate()-today.getDay());
    const thisWeek = [...sessions,...genaiSessions,...fluencySessions].filter(s=>new Date(s.date)>=weekStart).length;
    const uniqueProblems = new Set([...sessions.map(s=>s.problemTitle),...genaiSessions.map(s=>s.problemTitle)]).size;
    const totalPrompts = genaiSessions.reduce((a,s)=>a+(s.promptCount||0),0);
    const codeRunRate = genaiSessions.length>0 ? Math.round((genaiSessions.filter(s=>s.ranCode).length/genaiSessions.length)*100) : null;

    type AnySession = { date:string; title:string; type:'coding'|'genai'; label:string; category:string };
    const recentAll: AnySession[] = [
      ...sessions.map(s=>({ date:s.date, title:s.problemTitle, type:'coding' as const, label:`${s.overallScore}/10`, category:s.category })),
      ...genaiSessions.map(s=>({ date:s.date, title:s.problemTitle, type:'genai' as const, label:s.fluencyLevel, category:s.category })),
    ].sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime()).slice(0,4);

    return { totalSessions, codingSeconds, genaiSeconds, avgCodingScore, bestScore, avgGenaiScore,
      activityMap, currentStreak, longestStreak, improvement,
      skillAvg, genaiSkillAvg, topCategories, diffCount, bestSession,
      thisWeek, uniqueProblems, totalPrompts, codeRunRate, recentAll };
  }, [sessions, genaiSessions, loaded]);

  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US',{month:'short',year:'numeric'}) : null;
  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName?'_'+user.lastName:''}`
    : user?.username ?? user?.emailAddresses[0]?.emailAddress?.split('@')[0] ?? 'User';

  const dotGrid = {
    background: T.surface,
    backgroundImage: 'radial-gradient(circle, #262627 1px, transparent 1px)',
    backgroundSize: '24px 24px',
  };

  // ── Loading ──
  if (!authLoaded || !loaded) return (
    <div className="min-h-screen flex items-center justify-center" style={dotGrid}>
      <p style={{ ...type.labelMd, color: T.textMuted }} className="animate-pulse">{'// loading...'}</p>
    </div>
  );

  // ── Signed out ──
  if (!isSignedIn) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={dotGrid}>
      <div className="text-center max-w-sm">
        <p style={{ ...type.labelSm, color: T.textMuted, marginBottom: 16 }}>{'// profile'}</p>
        <h1 style={{ ...type.displayLg, color: T.textPrimary, marginBottom: 10 }}>Sign in to view your profile</h1>
        <p style={{ ...type.bodyMd, color: T.textSecond, marginBottom: 28 }}>Track streaks, scores, and skill growth over time.</p>
        <SignInButton mode="modal">
          <button style={{ background:`linear-gradient(135deg,${T.primary},${T.primaryCont})`, color:'#002c66', padding:'10px 24px', ...type.titleSm, borderRadius:'0.375rem' }}>
            Sign In
          </button>
        </SignInButton>
      </div>
    </div>
  );

  const noData = !stats || stats.totalSessions === 0;

  return (
    <div style={dotGrid} className="min-h-screen" id="top">
      {/* Per-page hover & transition styles */}
      <style>{`
        .bento-card { transition: box-shadow 0.25s ease; }
        .bento-card:hover { box-shadow: 0 0 20px rgba(133,173,255,0.1); }
        .ghost-btn { transition: background 0.15s ease; }
        .ghost-btn:hover { background: rgba(133,173,255,0.06) !important; }
      `}</style>

      {/* ── Main ── */}
      <main className="px-6 lg:px-10 py-10">

        {/* ── Profile Header ── */}
        <header className="flex items-end justify-between mb-10">
          <div>
            {/* Display-LG: 3.5rem, 700, -0.02em */}
            <h1 style={{ ...type.displayLg, color: T.textPrimary }}>{displayName}</h1>
            <div className="flex flex-wrap gap-4 mt-2">
              <span style={{ ...type.labelMd, color: T.textSecond }}>{user?.emailAddresses[0]?.emailAddress}</span>
              {memberSince && (
                <span style={{ ...type.labelMd, color: T.textMuted, borderLeft:`1px solid ${T.outline}`, paddingLeft:16 }}>
                  Joined {memberSince}
                </span>
              )}
            </div>
          </div>
          {/* Primary CTA — gradient, 0.375rem radius, Space Grotesk semi-bold */}
          <Link href="/problems" className="hidden sm:flex items-center gap-2"
            style={{ background:`linear-gradient(135deg,${T.primary},${T.primaryCont})`, color:'#002c66',
              padding:'10px 20px', ...type.titleSm, borderRadius:'0.375rem', textDecoration:'none', flexShrink:0 }}>
            Practice <IcoArrow />
          </Link>
        </header>

        {noData ? (
          <div className="flex flex-col items-center justify-center py-32">
            <p style={{ ...type.labelSm, color: T.textMuted, marginBottom:14 }}>{'// no data yet'}</p>
            <h2 style={{ ...type.headlineMd, color: T.textSecond, marginBottom:8 }}>No sessions completed</h2>
            <p style={{ ...type.bodyMd, color: T.textMuted, marginBottom:28 }}>Complete your first interview to start tracking progress.</p>
            <Link href="/problems"
              style={{ background:`linear-gradient(135deg,${T.primary},${T.primaryCont})`, color:'#002c66',
                padding:'10px 24px', ...type.titleSm, borderRadius:'0.375rem', textDecoration:'none' }}>
              Browse Problems
            </Link>
          </div>
        ) : (
          <>
            {/* ── Stats Row — tonal stacking, accent border-top 0.25rem ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {[
                { label:'Total Sessions',  value:String(stats!.totalSessions),   sub:`${sessions.length} Coding / ${genaiSessions.length} GenAI`, accent:T.primary },
                { label:'Practice Time',   value:formatDuration(stats!.codingSeconds+stats!.genaiSeconds), sub:`${formatDuration(stats!.codingSeconds)} coding / ${formatDuration(stats!.genaiSeconds)} genai`, accent:T.secondary },
                { label:'Current Streak',  value:`${stats!.currentStreak} days`, sub:`Best: ${stats!.longestStreak} days`, accent:T.tertiary },
                { label:'Best Score',      value:stats!.bestScore!==null?String(stats!.bestScore):'—', sub:stats!.avgCodingScore!==null?`Avg: ${stats!.avgCodingScore.toFixed(1)}`:undefined, accent:T.primaryCont },
              ].map(({ label, value, sub, accent }) => (
                <div key={label} className="bento-card" style={{ background:T.surfaceMid, borderTop:`0.25rem solid ${accent}`, padding:'20px 20px 18px' }}>
                  <p style={{ ...type.labelSm, color:T.textSecond, marginBottom:8 }}>{label}</p>
                  <p style={{ fontFamily:'var(--font-space-grotesk), sans-serif', fontSize:'2.1rem', fontWeight:700, color:accent, lineHeight:1 }}>{value}</p>
                  {sub && <p style={{ ...type.labelSm, color:T.textMuted, marginTop:8 }}>{sub}</p>}
                </div>
              ))}
            </div>

            {/* ── Activity Calendar — surface-container-low, no border ── */}
            <div id="activity" style={{ background:T.surfaceLow, padding:'24px 28px', marginBottom:16 }}>
              <div className="flex items-center justify-between mb-6">
                <h3 style={{ ...type.titleSm, color:T.textPrimary }}>
                  {stats!.totalSessions} sessions in the last year
                </h3>
                <span style={{ ...type.labelSm, color:T.textMuted }}>{Object.keys(stats!.activityMap).length} active days</span>
              </div>
              <ActivityCalendar activityMap={stats!.activityMap} />
            </div>

            {/* ── At a Glance — surface-container-low bg shift, no border or dividers ── */}
            <div className="flex flex-wrap mb-8" style={{ background:T.surfaceLow, padding:'0 8px' }}>
              {([
                stats!.improvement!==null && { label:'Improvement', value:`${stats!.improvement!>=0?'+':''}${stats!.improvement!.toFixed(1)}`, unit:'delta', color:stats!.improvement!>=0?T.tertiaryDim:'#ff716c' },
                { label:'This Week',       value:String(stats!.thisWeek),        unit:'sessions',  color:T.textPrimary },
                { label:'Problems Solved', value:String(stats!.uniqueProblems),  unit:'unique',    color:T.textPrimary },
                stats!.avgGenaiScore!==null && { label:'Avg GenAI Score', value:stats!.avgGenaiScore.toFixed(1), unit:'/5', color:T.secondary },
              ] as (false | { label:string; value:string; unit:string; color:string })[])
                .filter(Boolean)
                .map((item) => {
                  const it = item as { label:string; value:string; unit:string; color:string };
                  return (
                    <div key={it.label} style={{ padding:'20px 28px' }}>
                      <p style={{ ...type.labelSm, color:T.textMuted, marginBottom:5 }}>{it.label}</p>
                      <p style={{ fontFamily:'var(--font-space-grotesk), sans-serif', fontWeight:700, fontSize:'1.25rem', color:it.color }}>
                        {it.value} <span style={{ ...type.labelMd, color:T.textMuted }}>{it.unit}</span>
                      </p>
                    </div>
                  );
                })}
            </div>

            {/* ── Skills — surface-container with accent border-top 0.25rem ── */}
            <div id="skills" className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
              {stats!.skillAvg && (
                <div className="bento-card" style={{ background:T.surfaceMid, borderTop:`0.25rem solid ${T.primary}`, padding:'28px 28px 24px' }}>
                  <div className="flex items-center gap-2 mb-7">
                    <span style={{ color:T.primary }}><IcoCode /></span>
                    {/* Title uppercase — Space Grotesk, sparingly per spec */}
                    <h3 style={{ fontFamily:'var(--font-space-grotesk), sans-serif', fontSize:'1rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', color:T.textPrimary }}>Coding Metrics</h3>
                    <span style={{ ...type.labelSm, color:T.textMuted, marginLeft:'auto' }}>{sessions.length} sessions</span>
                  </div>
                  <div className="space-y-5">
                    <SkillBar label="Communication"  value={stats!.skillAvg.communication}  maxValue={10} color={T.primary} />
                    <SkillBar label="Problem Solving" value={stats!.skillAvg.problemSolving} maxValue={10} color={T.primary} />
                    <SkillBar label="Code Quality"    value={stats!.skillAvg.codeQuality}    maxValue={10} color={T.primary} />
                  </div>
                </div>
              )}

              {stats!.genaiSkillAvg ? (
                <div className="bento-card" style={{ background:T.surfaceMid, borderTop:`0.25rem solid ${T.secondary}`, padding:'28px 28px 24px' }}>
                  <div className="flex items-center gap-2 mb-7">
                    <span style={{ color:T.secondary }}><IcoSparkle /></span>
                    <h3 style={{ fontFamily:'var(--font-space-grotesk), sans-serif', fontSize:'1rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', color:T.textPrimary }}>GenAI Orchestration</h3>
                    <span style={{ ...type.labelSm, color:T.textMuted, marginLeft:'auto' }}>{genaiSessions.length} sessions</span>
                  </div>
                  <div className="space-y-4">
                    <SkillBar label="Prompt Quality"    value={stats!.genaiSkillAvg.promptQuality}    maxValue={5} color={T.secondary} />
                    <SkillBar label="Output Validation" value={stats!.genaiSkillAvg.outputValidation} maxValue={5} color={T.secondary} />
                    <SkillBar label="Human Judgment"    value={stats!.genaiSkillAvg.humanJudgment}    maxValue={5} color={T.secondary} />
                    <SkillBar label="Accountability"    value={stats!.genaiSkillAvg.accountability}    maxValue={5} color={T.secondary} />
                  </div>
                  {(stats!.totalPrompts > 0 || stats!.codeRunRate !== null) && (
                    <div className="flex justify-between mt-6 pt-5" style={{ borderTop:`1px solid ${T.outline}` }}>
                      {stats!.totalPrompts > 0 && <span style={{ ...type.labelSm, color:T.textMuted }}>Prompts: <span style={{ color:T.secondary }}>{stats!.totalPrompts}</span></span>}
                      {stats!.codeRunRate !== null && <span style={{ ...type.labelSm, color:T.textMuted }}>Exec Rate: <span style={{ color:T.secondary }}>{stats!.codeRunRate}%</span></span>}
                    </div>
                  )}
                </div>
              ) : stats!.skillAvg ? (
                /* Focus card — ghost border only at 15% opacity */
                <div className="bento-card" style={{ background:T.surfaceMid, borderTop:`0.25rem solid ${T.outline}`, padding:'28px 28px 24px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                  <div>
                    <h3 style={{ fontFamily:'var(--font-space-grotesk), sans-serif', fontSize:'1rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', color:T.textPrimary, marginBottom:20 }}>Focus Area</h3>
                    {(() => {
                      const s = stats!.skillAvg!;
                      const ranked = [
                        { label:'Communication',  value:s.communication },
                        { label:'Problem Solving', value:s.problemSolving },
                        { label:'Code Quality',    value:s.codeQuality },
                      ].sort((a,b)=>a.value-b.value);
                      return (
                        <div className="space-y-3">
                          {/* Difficulty-style badge for the "hard" skill */}
                          <div style={{ background:`rgba(215,56,59,0.08)`, borderLeft:`3px solid ${T.errorDim}`, padding:'12px 16px' }}>
                            <p style={{ ...type.labelSm, color:T.errorDim, marginBottom:4 }}>Lowest score</p>
                            <p style={{ ...type.titleSm, color:T.textPrimary }}>{ranked[0].label}</p>
                            <p style={{ ...type.labelSm, color:T.textMuted, marginTop:3 }}>avg {ranked[0].value.toFixed(1)}/10 — focus here</p>
                          </div>
                          <div style={{ background:`rgba(88,231,171,0.06)`, borderLeft:`3px solid ${T.tertiaryDim}`, padding:'12px 16px' }}>
                            <p style={{ ...type.labelSm, color:T.tertiaryDim, marginBottom:4 }}>Strongest skill</p>
                            <p style={{ ...type.titleSm, color:T.textPrimary }}>{ranked[2].label}</p>
                            <p style={{ ...type.labelSm, color:T.textMuted, marginTop:3 }}>avg {ranked[2].value.toFixed(1)}/10 — keep it up</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <div style={{ borderTop:`1px solid ${T.outline}`, paddingTop:16, marginTop:20 }}>
                    <p style={{ ...type.labelSm, color:T.textMuted, marginBottom:10 }}>No GenAI sessions yet.</p>
                    {/* Tertiary button — text-only, JetBrains Mono, all-caps, primary color */}
                    <Link href="/problems" style={{ ...type.labelSm, color:T.secondary, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6 }}>
                      Explore GenAI track →
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            {/* ── Difficulty + Categories — surface-container, no borders between items ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <div className="bento-card" style={{ background:T.surfaceMid, padding:'24px 24px 20px' }}>
                <h4 style={{ fontFamily:'var(--font-space-grotesk), sans-serif', fontSize:'0.8rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:T.textPrimary, marginBottom:20 }}>Difficulty Breakdown</h4>
                {/* Stacked bar */}
                <div className="flex mb-5" style={{ height:38, gap:2 }}>
                  {(['easy','medium','hard'] as const).map(dk => {
                    const count = stats!.diffCount[dk]??0;
                    const pct = stats!.totalSessions>0 ? (count/stats!.totalSessions)*100 : 0;
                    if (pct===0) return null;
                    const cfg = {
                      easy:   { bg:'rgba(88,231,171,0.12)',  border:T.tertiaryDim, text:T.tertiaryDim },
                      medium: { bg:'rgba(173,170,171,0.08)', border:T.textSecond,  text:T.textSecond  },
                      hard:   { bg:'rgba(215,56,59,0.10)',   border:T.errorDim,    text:T.errorDim    },
                    }[dk];
                    return (
                      <div key={dk} className="flex items-center justify-center"
                        style={{ width:`${pct}%`, background:cfg.bg, borderLeft:`2px solid ${cfg.border}` }}>
                        <span style={{ ...type.labelSm, color:cfg.text }}>{Math.round(pct)}%</span>
                      </div>
                    );
                  })}
                </div>
                {/* List items — spacing-4 gaps, no dividers */}
                <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                  {([
                    { dk:'easy',   label:'Easy',   color:T.tertiaryDim },
                    { dk:'medium', label:'Medium', color:T.textSecond  },
                    { dk:'hard',   label:'Hard',   color:T.errorDim    },
                  ] as { dk:string; label:string; color:string }[]).map(({ dk, label, color }) => (
                    <div key={dk} className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span style={{ width:7, height:7, borderRadius:'50%', background:color, display:'inline-block' }} />
                        {/* Difficulty badge per spec — JetBrains Mono */}
                        <span style={{ ...type.labelMd, color:T.textSecond }}>{label}</span>
                      </span>
                      <span style={{ ...type.labelMd, color:T.textMuted }}>{stats!.diffCount[dk]??0} solved</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bento-card" style={{ background:T.surfaceMid, padding:'24px 24px 20px' }}>
                <h4 style={{ fontFamily:'var(--font-space-grotesk), sans-serif', fontSize:'0.8rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:T.textPrimary, marginBottom:20 }}>Top Problem Types</h4>
                {stats!.topCategories.length===0 ? (
                  <p style={{ ...type.labelMd, color:T.textMuted }}>{'// no data'}</p>
                ) : (
                  /* No dividers — spacing-4 vertical gaps per spec */
                  <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                    {stats!.topCategories.map(([cat,count]) => {
                      const pct = (count/stats!.topCategories[0][1])*100;
                      return (
                        <div key={cat}>
                          <div className="flex justify-between mb-1.5">
                            <span style={{ ...type.labelSm, color:T.textSecond }} className="truncate max-w-[180px]">{cat}</span>
                            <span style={{ ...type.labelMd, color:T.textPrimary }}>{count}</span>
                          </div>
                          <div style={{ height:3, background:T.surfaceTop }}>
                            <div style={{ height:'100%', width:`${pct}%`, background:`rgba(133,173,255,0.35)` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ── Best Session + Recent Activity ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 pb-20">
              {/* Top Performance — surface-container-low tonal plate */}
              {stats!.bestSession && (
                <div className="bento-card lg:col-span-2 relative overflow-hidden group"
                  style={{ background:T.surfaceLow }}>
                  <div className="absolute top-0 right-0 p-8 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity pointer-events-none"
                    style={{ fontSize:100, lineHeight:1, color:T.textPrimary, userSelect:'none' }}>★</div>
                  <div className="relative p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {/* Difficulty badge per spec — JetBrains Mono, error-dim on error-container 10% */}
                          <span style={{
                            background:'rgba(215,56,59,0.10)', color:T.errorDim,
                            border:`1px solid rgba(215,56,59,0.2)`,
                            ...type.labelSm, padding:'3px 8px', borderRadius:'0.125rem'
                          }}>{stats!.bestSession.difficulty.toUpperCase()}</span>
                          <span style={{ ...type.labelSm, color:T.textMuted }}>{stats!.bestSession.category}</span>
                        </div>
                        <h3 style={{ ...type.headlineMd, color:T.textPrimary }}>{stats!.bestSession.problemTitle}</h3>
                        <p style={{ ...type.labelMd, color:T.textMuted, marginTop:4 }}>
                          {new Date(stats!.bestSession.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p style={{ ...type.labelSm, color:T.textMuted, marginBottom:2 }}>Score</p>
                        {/* JetBrains Mono for the output/calculated value */}
                        <p style={{ fontFamily:'var(--font-jetbrains-mono), monospace', fontSize:'2.5rem', fontWeight:700, color:T.tertiary, lineHeight:1 }}>
                          {stats!.bestSession.overallScore}
                        </p>
                      </div>
                    </div>
                    {stats!.bestSession.topImprovements?.[0] && (
                      <div style={{ background:`rgba(133,173,255,0.04)`, borderLeft:`3px solid ${T.primary}`, padding:'16px 20px', borderRadius:'0.125rem' }}>
                        <p style={{ fontFamily:'var(--font-space-grotesk), sans-serif', fontSize:'0.8rem', fontWeight:600, color:T.primary, marginBottom:6 }}>
                          Key Improvement Note
                        </p>
                        <p style={{ ...type.bodyMd, color:T.textSecond, lineHeight:1.65 }}>
                          &ldquo;{stats!.bestSession.topImprovements[0]}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Activity — surface-container, no dividers, spacing-4 gaps */}
              {stats!.recentAll.length > 0 && (
                <div className="bento-card" style={{ background:T.surfaceMid, padding:'24px' }}>
                  <h4 style={{ fontFamily:'var(--font-space-grotesk), sans-serif', fontSize:'0.8rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:T.textPrimary, marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${T.outline}` }}>
                    Recent Activity
                  </h4>
                  {/* No dividers — spacing-4 (1rem) vertical gaps per spec */}
                  <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                    {stats!.recentAll.map((s, i) => (
                      <div key={i} className="ghost-btn flex items-start gap-3 cursor-default"
                        style={{ padding:'8px 6px', borderRadius:'0.125rem' }}>
                        <div className="shrink-0 flex items-center justify-center"
                          style={{ width:36, height:36, background:T.surfaceTop, color:s.type==='coding'?T.primary:T.secondary, borderRadius:'0.125rem' }}>
                          {s.type==='coding' ? <IcoCode /> : <IcoSparkle />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <p className="truncate" style={{ ...type.bodyMd, color:T.textPrimary, fontWeight:500 }}>{s.title}</p>
                            {/* Calculated value — JetBrains Mono per spec */}
                            <span style={{ ...type.labelMd, color:s.type==='coding'?T.tertiary:T.secondary, flexShrink:0 }}>{s.label}</span>
                          </div>
                          <p style={{ ...type.labelSm, color:T.textMuted, marginTop:3 }}>{s.type} · {s.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Tertiary button style — text-only, JetBrains Mono, all-caps */}
                  <Link href="/history" style={{ display:'block', marginTop:20, ...type.labelSm, color:T.textMuted, textAlign:'center', textDecoration:'none' }}
                    onMouseEnter={e=>(e.currentTarget.style.color=T.primary)}
                    onMouseLeave={e=>(e.currentTarget.style.color=T.textMuted)}>
                    View All Activity →
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
