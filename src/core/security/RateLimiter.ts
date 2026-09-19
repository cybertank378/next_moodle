export interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
}

export class InMemoryRateLimiter {
  private readonly hits = new Map<string, { count: number; resetAt: number }>();

  constructor(private readonly options: RateLimiterOptions) {}

  public isAllowed(key: string): {
    allowed: boolean;
    remaining: number;
    resetAt: number;
  } {
    const now = Date.now();
    const entry = this.hits.get(key);

    if (!entry || now > entry.resetAt) {
      const resetAt = now + this.options.windowMs;
      this.hits.set(key, { count: 1, resetAt });
      return {
        allowed: true,
        remaining: this.options.maxRequests - 1,
        resetAt,
      };
    }

    if (entry.count >= this.options.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt,
      };
    }

    entry.count += 1;
    return {
      allowed: true,
      remaining: this.options.maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  }

  public reset(key: string): void {
    this.hits.delete(key);
  }
}
