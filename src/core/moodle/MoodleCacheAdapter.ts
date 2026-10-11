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
  sweep?(): void;
}

export interface InMemoryCacheAdapterOptions {
  maxEntries?: number;
}

const DEFAULT_MAX_ENTRIES = 500;

export class InMemoryCacheAdapter implements CacheAdapter {
  private readonly store = new Map<string, CacheEntry<unknown>>();
  private readonly maxEntries: number;

  constructor(options: InMemoryCacheAdapterOptions = {}) {
    this.maxEntries = options.maxEntries && options.maxEntries > 0
      ? options.maxEntries
      : DEFAULT_MAX_ENTRIES;
  }

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    // Re-insert to maintain LRU order (most recently accessed at the end)
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.maxEntries) {
      // First try to sweep expired items to reclaim space
      this.sweep();
      // If still at capacity, evict the least recently used (first item in Map iterator)
      if (this.store.size >= this.maxEntries) {
        const oldestKey = this.store.keys().next().value;
        if (oldestKey !== undefined) {
          this.store.delete(oldestKey);
        }
      }
    }

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

  /**
   * Sweeps and actively removes expired entries from the store
   * to release memory even if keys are never read again.
   */
  sweep(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
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

const SENSITIVE_PARAM_KEYS = new Set([
  "wstoken",
  "token",
  "password",
  "secret",
  "auth",
]);

function canonicalizeValue(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (Array.isArray(val)) {
    return `[${val.map(canonicalizeValue).join(",")}]`;
  }
  if (typeof val === "object") {
    const obj = val as Record<string, unknown>;
    const sortedKeys = Object.keys(obj).sort();
    return `{${sortedKeys.map((k) => `${k}:${canonicalizeValue(obj[k])}`).join(",")}}`;
  }
  return String(val);
}

/**
 * Build a deterministic, tenant-isolated cache key from wsfunction + params + source.
 * Sensitive tokens are stripped and parameters are canonically serialized.
 */
export function buildCacheKey(
  wsfunction: string,
  params: Record<string, unknown> = {},
  source?: string,
): string {
  const safeKeys = Object.keys(params)
    .filter((k) => !SENSITIVE_PARAM_KEYS.has(k.toLowerCase()))
    .sort();

  const stable = safeKeys
    .map((k) => `${k}=${canonicalizeValue(params[k])}`)
    .join("&");

  const prefix = source ? `moodle:${source}` : "moodle";
  return `${prefix}:${wsfunction}:${stable}`;
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

