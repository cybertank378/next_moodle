export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

export interface RateLimiterOptions {
  limit: number;
  windowMs: number;
  maxBuckets?: number;
}

export interface RateLimiter {
  limit(key: string): Promise<RateLimitResult>;
  sweep?(): void;
}

interface BucketEntry {
  count: number;
  resetAt: number;
}

const DEFAULT_MAX_BUCKETS = 10_000;

export class InMemoryRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, BucketEntry>();
  private readonly maxLimit: number;
  private readonly windowMs: number;
  private readonly maxBuckets: number;

  constructor(options: RateLimiterOptions) {
    this.maxLimit = options.limit;
    this.windowMs = options.windowMs;
    this.maxBuckets =
      options.maxBuckets && options.maxBuckets > 0
        ? options.maxBuckets
        : DEFAULT_MAX_BUCKETS;
  }

  async limit(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.buckets.get(key);

    if (!entry || now >= entry.resetAt) {
      if (!entry && this.buckets.size >= this.maxBuckets) {
        this.sweep();
        if (this.buckets.size >= this.maxBuckets) {
          const oldestKey = this.buckets.keys().next().value;
          if (oldestKey !== undefined) {
            this.buckets.delete(oldestKey);
          }
        }
      }

      const resetAt = now + this.windowMs;
      this.buckets.set(key, { count: 1, resetAt });
      return {
        success: true,
        limit: this.maxLimit,
        remaining: Math.max(0, this.maxLimit - 1),
        resetAt,
      };
    }

    if (entry.count >= this.maxLimit) {
      return {
        success: false,
        limit: this.maxLimit,
        remaining: 0,
        resetAt: entry.resetAt,
      };
    }

    entry.count += 1;
    return {
      success: true,
      limit: this.maxLimit,
      remaining: Math.max(0, this.maxLimit - entry.count),
      resetAt: entry.resetAt,
    };
  }

  sweep(): void {
    const now = Date.now();
    for (const [key, entry] of this.buckets.entries()) {
      if (now >= entry.resetAt) {
        this.buckets.delete(key);
      }
    }
  }

  get size(): number {
    return this.buckets.size;
  }
}

