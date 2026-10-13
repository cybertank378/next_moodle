import { describe, expect, it } from "vitest";
import { InMemoryRateLimiter } from "@/core/security/RateLimiter";

describe("InMemoryRateLimiter", () => {
  it("should allow requests within limit and return accurate remaining count", async () => {
    const limiter = new InMemoryRateLimiter({
      limit: 3,
      windowMs: 60 * 1000,
    });

    const res1 = await limiter.limit("client_ip_1");
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(2);
    expect(res1.limit).toBe(3);

    const res2 = await limiter.limit("client_ip_1");
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(1);

    const res3 = await limiter.limit("client_ip_1");
    expect(res3.success).toBe(true);
    expect(res3.remaining).toBe(0);

    const res4 = await limiter.limit("client_ip_1");
    expect(res4.success).toBe(false);
    expect(res4.remaining).toBe(0);
  });

  it("should isolate rate limits across different keys", async () => {
    const limiter = new InMemoryRateLimiter({
      limit: 2,
      windowMs: 60 * 1000,
    });

    await limiter.limit("user_a");
    await limiter.limit("user_a");
    const blockedA = await limiter.limit("user_a");
    expect(blockedA.success).toBe(false);

    // user_b should still be allowed
    const resB = await limiter.limit("user_b");
    expect(resB.success).toBe(true);
    expect(resB.remaining).toBe(1);
  });

  it("should enforce maxBuckets capacity and evict oldest when exceeded", async () => {
    const boundedLimiter = new InMemoryRateLimiter({
      limit: 10,
      windowMs: 60 * 1000,
      maxBuckets: 2,
    });

    await boundedLimiter.limit("key1");
    await boundedLimiter.limit("key2");
    await boundedLimiter.limit("key3"); // Should evict oldest key to keep within capacity

    // Capacity must not exceed maxBuckets
    expect(boundedLimiter.size).toBeLessThanOrEqual(2);
  });

  it("should sweep expired buckets to reclaim memory", async () => {
    const limiter = new InMemoryRateLimiter({
      limit: 5,
      windowMs: 50,
    });

    await limiter.limit("temp_key");
    expect(limiter.size).toBe(1);

    await new Promise((resolve) => setTimeout(resolve, 60));
    limiter.sweep();

    expect(limiter.size).toBe(0);
  });
});

