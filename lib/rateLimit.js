/**
 * Admin Security Rate Limiter (lib/rateLimit.js)
 * Rule: 5 failed attempts within 15 minutes triggers a 30-minute lockout.
 */

const STORAGE_KEY = 'biogenius_admin_ratelimit';
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const BLOCK_MS = 30 * 60 * 1000; // 30 minutes

function getState() {
  if (typeof window === 'undefined') return { attempts: [], blockedUntil: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { attempts: [], blockedUntil: null };
    return JSON.parse(raw);
  } catch {
    return { attempts: [], blockedUntil: null };
  }
}

function saveState(state) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function checkAdminRateLimit() {
  const now = Date.now();
  const state = getState();

  if (state.blockedUntil && state.blockedUntil > now) {
    const minutesRemaining = Math.ceil((state.blockedUntil - now) / (60 * 1000));
    return { isBlocked: true, minutesRemaining, attemptsRemaining: 0 };
  }

  const recentAttempts = (state.attempts || []).filter((ts) => now - ts < WINDOW_MS);
  if (recentAttempts.length !== (state.attempts || []).length || state.blockedUntil) {
    saveState({ attempts: recentAttempts, blockedUntil: null });
  }

  const attemptsRemaining = Math.max(0, MAX_ATTEMPTS - recentAttempts.length);
  return { isBlocked: false, minutesRemaining: 0, attemptsRemaining };
}

export function recordFailedAdminAttempt() {
  const now = Date.now();
  const state = getState();

  const recentAttempts = (state.attempts || []).filter((ts) => now - ts < WINDOW_MS);
  recentAttempts.push(now);

  if (recentAttempts.length >= MAX_ATTEMPTS) {
    const blockedUntil = now + BLOCK_MS;
    saveState({ attempts: recentAttempts, blockedUntil });
    return {
      isBlocked: true,
      minutesRemaining: 30,
      attemptsRemaining: 0,
    };
  }

  saveState({ attempts: recentAttempts, blockedUntil: null });
  return {
    isBlocked: false,
    minutesRemaining: 0,
    attemptsRemaining: MAX_ATTEMPTS - recentAttempts.length,
  };
}

export function resetAdminRateLimit() {
  saveState({ attempts: [], blockedUntil: null });
}
