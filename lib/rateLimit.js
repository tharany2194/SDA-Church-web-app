/**
 * Simple in-memory rate limiter for Next.js API routes.
 * For production with multiple instances, replace with Redis-based limiting.
 */

const stores = new Map();

/**
 * Check rate limit for a given key (usually IP address).
 * @param {string} key - Unique identifier (IP, user ID, etc.)
 * @param {object} options
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 min)
 * @param {number} options.max - Max requests per window
 * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
 */
export function rateLimit(key, { windowMs = 15 * 60 * 1000, max = 200 } = {}) {
  const now = Date.now();

  let entry = stores.get(key);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
  }

  entry.count += 1;
  stores.set(key, entry);

  // Periodically clean stale entries to prevent memory leak
  if (stores.size > 10000) {
    for (const [k, v] of stores.entries()) {
      if (now > v.resetAt) stores.delete(k);
    }
  }

  return {
    allowed: entry.count <= max,
    remaining: Math.max(0, max - entry.count),
    resetAt: entry.resetAt,
  };
}

import { NextResponse } from 'next/server';

/**
 * Returns a rate-limit check function for API routes.
 * Usage: const rl = createLimiter({ windowMs, max });
 *        const limited = rl(request); if (limited) return limited;
 */
export function createLimiter({ windowMs = 15 * 60 * 1000, max = 200 } = {}) {
  return function check(request) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const { allowed } = rateLimit(ip, { windowMs, max });
    if (!allowed) {
      return NextResponse.json(
        { success: false, message: 'Too many requests, please try again later.' },
        { status: 429 }
      );
    }
    return null;
  };
}
