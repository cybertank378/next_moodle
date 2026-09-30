import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  InMemoryCacheAdapter,
  buildCacheKey,
  CACHE_TTL,
} from "@/core/moodle/MoodleCacheAdapter";

describe("InMemoryCacheAdapter", () => {
  let cache: InMemoryCacheAdapter;

  beforeEach(() => {
    cache = new InMemoryCacheAdapter();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return undefined for a missing key", () => {
    expect(cache.get("nonexistent")).toBeUndefined();
  });

  it("should store and retrieve a value within TTL", () => {
    cache.set("key1", { courses: [1, 2] }, 5000);
    expect(cache.get("key1")).toEqual({ courses: [1, 2] });
  });

  it("should return undefined after TTL expires", () => {
    cache.set("key1", "value", 1000);
    vi.advanceTimersByTime(1001);
    expect(cache.get("key1")).toBeUndefined();
  });

  it("should return value just before TTL expires", () => {
    cache.set("key1", "value", 1000);
    vi.advanceTimersByTime(999);
    expect(cache.get("key1")).toBe("value");
  });

  it("should invalidate a specific key", () => {
    cache.set("key1", "val1", 60_000);
    cache.set("key2", "val2", 60_000);
    cache.invalidate("key1");
    expect(cache.get("key1")).toBeUndefined();
    expect(cache.get("key2")).toBe("val2");
  });

  it("should clear all entries", () => {
    cache.set("a", 1, 60_000);
    cache.set("b", 2, 60_000);
    cache.clear();
    expect(cache.get("a")).toBeUndefined();
    expect(cache.get("b")).toBeUndefined();
    expect(cache.size).toBe(0);
  });

  it("should report size excluding expired entries", () => {
    cache.set("live", "yes", 60_000);
    cache.set("expiring", "yes", 1000);
    expect(cache.size).toBe(2);

    vi.advanceTimersByTime(1001);
    expect(cache.size).toBe(1);
  });

  it("should overwrite existing key with new value and TTL", () => {
    cache.set("k", "old", 1000);
    cache.set("k", "new", 5000);
    expect(cache.get("k")).toBe("new");

    vi.advanceTimersByTime(1001);
    // Still alive because new TTL is 5000ms
    expect(cache.get("k")).toBe("new");
  });
});

describe("buildCacheKey", () => {
  it("should produce deterministic keys regardless of param order", () => {
    const key1 = buildCacheKey("core_course_get_courses", {
      userid: 42,
      field: "id",
    });
    const key2 = buildCacheKey("core_course_get_courses", {
      field: "id",
      userid: 42,
    });
    expect(key1).toBe(key2);
  });

  it("should produce different keys for different wsfunctions", () => {
    const key1 = buildCacheKey("func_a", { id: 1 });
    const key2 = buildCacheKey("func_b", { id: 1 });
    expect(key1).not.toBe(key2);
  });

  it("should produce different keys for different param values", () => {
    const key1 = buildCacheKey("func", { id: 1 });
    const key2 = buildCacheKey("func", { id: 2 });
    expect(key1).not.toBe(key2);
  });

  it("should include wsfunction prefix", () => {
    const key = buildCacheKey("mod_quiz_get_quizzes_by_courses", {
      courseids: "5",
    });
    expect(key).toContain("moodle:mod_quiz_get_quizzes_by_courses:");
  });
});

describe("CACHE_TTL constants", () => {
  it("should have SITE_INFO at 5 minutes", () => {
    expect(CACHE_TTL.SITE_INFO).toBe(5 * 60 * 1000);
  });

  it("should have COURSE_LIST at 2 minutes", () => {
    expect(CACHE_TTL.COURSE_LIST).toBe(2 * 60 * 1000);
  });

  it("should have HEALTH at 10 minutes", () => {
    expect(CACHE_TTL.HEALTH).toBe(10 * 60 * 1000);
  });

  it("should have SHORT at 30 seconds", () => {
    expect(CACHE_TTL.SHORT).toBe(30 * 1000);
  });
});
