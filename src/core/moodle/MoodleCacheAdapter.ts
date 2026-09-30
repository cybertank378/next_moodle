/**
 * MoodleCacheAdapter — lightweight in-memory TTL cache for static Moodle reads.
 *
 * Usage: wrap `MoodleRestClient.call()` for safe-read wsfunction calls whose
 * results rarely change (e.g. course list, site info, categories).
 *
 * Domain rule: this is an infrastructure concern. Domain/application code must
 * NOT import this file directly — inject via the repository layer.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface CacheAdapter {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T, ttlMs: number): void;
  invalidate(key: string): void;
  clear(): void;
}

export class InMemoryCacheAdapter implements CacheAdapter {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  /** Total number of live (non-expired) entries. */
  get size(): number {
    const now = Date.now();
    let count = 0;
    for (const entry of this.store.values()) {
      if (now <= entry.expiresAt) count++;
    }
    return count;
  }
}

/**
 * Build a deterministic cache key from wsfunction + params.
 * Stable JSON.stringify is sufficient since Moodle params are plain objects.
 */
export function buildCacheKey(
  wsfunction: string,
  params: Record<string, unknown>,
): string {
  const stable = Object.keys(params)
    .sort()
    .map((k) => `${k}=${String(params[k])}`)
    .join("&");
  return `moodle:${wsfunction}:${stable}`;
}

/** Singleton shared across the Node.js process (per-deployment). */
export const moodleCache = new InMemoryCacheAdapter();

/** Default TTL values for common wsfunction call categories (milliseconds). */
export const CACHE_TTL = {
  /** Site info / capabilities — refresh every 5 minutes */
  SITE_INFO: 5 * 60 * 1_000,
  /** Course/category lists — refresh every 2 minutes */
  COURSE_LIST: 2 * 60 * 1_000,
  /** Health / api version — refresh every 10 minutes */
  HEALTH: 10 * 60 * 1_000,
  /** Short-lived reads (question lists, etc.) — 30 seconds */
  SHORT: 30 * 1_000,
} as const;
