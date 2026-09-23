import { describe, expect, it } from "vitest";
import { encodeMoodleParams } from "@/core/moodle/MoodleEncoder";

describe("MoodleEncoder", () => {
  it("should encode scalar parameters accurately", () => {
    const params = {
      wsfunction: "core_course_get_courses",
      moodlewsrestformat: "json",
      courseid: 42,
    };

    const encoded = encodeMoodleParams(params);
    const parsed = new URLSearchParams(encoded);

    expect(parsed.get("wsfunction")).toBe("core_course_get_courses");
    expect(parsed.get("moodlewsrestformat")).toBe("json");
    expect(parsed.get("courseid")).toBe("42");
  });

  it("should encode flat arrays using indexed bracket notation", () => {
    const params = {
      courseids: [10, 20, 30],
    };

    const encoded = encodeMoodleParams(params);
    const parsed = new URLSearchParams(encoded);

    expect(parsed.get("courseids[0]")).toBe("10");
    expect(parsed.get("courseids[1]")).toBe("20");
    expect(parsed.get("courseids[2]")).toBe("30");
  });

  it("should encode nested objects using nested bracket notation", () => {
    const params = {
      options: {
        filter: "active",
        limit: 5,
      },
    };

    const encoded = encodeMoodleParams(params);
    const parsed = new URLSearchParams(encoded);

    expect(parsed.get("options[filter]")).toBe("active");
    expect(parsed.get("options[limit]")).toBe("5");
  });

  it("should encode array of objects with indexed nested notation", () => {
    const params = {
      criteria: [
        { key: "category", value: "2" },
        { key: "search", value: "math & science" },
      ],
    };

    const encoded = encodeMoodleParams(params);
    const parsed = new URLSearchParams(encoded);

    expect(parsed.get("criteria[0][key]")).toBe("category");
    expect(parsed.get("criteria[0][value]")).toBe("2");
    expect(parsed.get("criteria[1][key]")).toBe("search");
    expect(parsed.get("criteria[1][value]")).toBe("math & science");
  });

  it("should convert booleans to 1 or 0", () => {
    const params = {
      includearray: true,
      onlyactive: false,
    };

    const encoded = encodeMoodleParams(params);
    const parsed = new URLSearchParams(encoded);

    expect(parsed.get("includearray")).toBe("1");
    expect(parsed.get("onlyactive")).toBe("0");
  });

  it("should skip null and undefined values", () => {
    const params = {
      valid: "yes",
      ignoredNull: null,
      ignoredUndefined: undefined,
    };

    const encoded = encodeMoodleParams(params);
    const parsed = new URLSearchParams(encoded);

    expect(parsed.get("valid")).toBe("yes");
    expect(parsed.has("ignoredNull")).toBe(false);
    expect(parsed.has("ignoredUndefined")).toBe(false);
  });
});
