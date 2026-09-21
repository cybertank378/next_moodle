import { describe, expect, it } from "vitest";
import { InMemoryRateLimiter } from "@/core/security";

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
});
