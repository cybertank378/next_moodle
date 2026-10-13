import { describe, expect, it } from "vitest";
import { ValidationError } from "@/core/errors/ValidationError";
import { parseScheduleQuery } from "@/modules/schedule/infrastructure/validators/scheduleValidator";

describe("scheduleValidator", () => {
  it("throws ValidationError when 'from' is missing", () => {
    const params = new URLSearchParams({ to: "2026-10-20" });
    expect(() => parseScheduleQuery(params)).toThrow(ValidationError);
  });

  it("throws ValidationError when 'to' is missing", () => {
    const params = new URLSearchParams({ from: "2026-10-01" });
    expect(() => parseScheduleQuery(params)).toThrow(ValidationError);
  });

  it("throws ValidationError when 'from' is after 'to'", () => {
    const params = new URLSearchParams({
      from: "2026-10-25",
      to: "2026-10-10",
    });
    expect(() => parseScheduleQuery(params)).toThrow(ValidationError);
  });

  it("throws ValidationError when window exceeds 95 days", () => {
    const params = new URLSearchParams({
      from: "2026-01-01",
      to: "2026-06-01",
    });
    expect(() => parseScheduleQuery(params)).toThrow(ValidationError);
  });

  it("successfully parses valid date range, types, and courseId", () => {
    const params = new URLSearchParams({
      from: "2026-10-01",
      to: "2026-10-31",
      types: "EXAM,LESSON,INVALID_TYPE",
      courseId: "42",
    });
    const parsed = parseScheduleQuery(params);

    expect(parsed.from).toBe("2026-10-01");
    expect(parsed.to).toBe("2026-10-31");
    expect(parsed.types).toEqual(["EXAM", "LESSON"]);
    expect(parsed.courseId).toBe(42);
  });
});
