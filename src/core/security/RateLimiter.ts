export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

export interface RateLimiterOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimiter {
  limit(key: string): Promise<RateLimitResult>;
}

interface BucketEntry {
  count: number;
  resetAt: number;
}

export class InMemoryRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, BucketEntry>();
  private readonly maxLimit: number;
  private readonly windowMs: number;

  constructor(options: RateLimiterOptions) {
    this.maxLimit = options.limit;
    this.windowMs = options.windowMs;
  }

  async limit(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.buckets.get(key);

    if (!entry || now >= entry.resetAt) {
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
}
