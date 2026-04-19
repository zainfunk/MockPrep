export type SessionType = 'coding' | 'genai';

const KEY_PREFIX = 'placed:session:v1:';
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

interface Envelope<T> {
  savedAt: number;
  data: T;
}

function key(type: SessionType, problemId: string): string {
  return `${KEY_PREFIX}${type}:${problemId}`;
}

export function saveSession<T>(type: SessionType, problemId: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    const envelope: Envelope<T> = { savedAt: Date.now(), data };
    localStorage.setItem(key(type, problemId), JSON.stringify(envelope));
  } catch {}
}

export function loadSession<T>(type: SessionType, problemId: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key(type, problemId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Envelope<T>;
    if (!parsed?.savedAt || Date.now() - parsed.savedAt > MAX_AGE_MS) {
      localStorage.removeItem(key(type, problemId));
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export function clearSession(type: SessionType, problemId: string): void {
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(key(type, problemId)); } catch {}
}

export function hasSavedSession(type: SessionType, problemId: string): boolean {
  return loadSession(type, problemId) !== null;
}
