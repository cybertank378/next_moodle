import { describe, expect, it } from "vitest";
import { parseCalendarEventsQuery } from "@/modules/calendar/infrastructure/validators/calendarValidator";

describe("calendarValidator", () => {
  it("parses valid from and to query params", () => {
    const params = new URLSearchParams("from=2026-10-01&to=2026-10-31");
    const result = parseCalendarEventsQuery(params);

    expect(result.from).toBe("2026-10-01");
    expect(result.to).toBe("2026-10-31");
    expect(result.types).toBeUndefined();
  });

  it("parses valid types filter", () => {
    const params = new URLSearchParams(
      "from=2026-10-01&to=2026-10-31&types=QUIZ_EXAM,COURSE_CLASS,INVALID_TYPE",
    );
    const result = parseCalendarEventsQuery(params);

    expect(result.types).toEqual(["QUIZ_EXAM", "COURSE_CLASS"]);
  });

  it("throws ValidationError when from or to is missing", () => {
    expect(() =>
      parseCalendarEventsQuery(new URLSearchParams("to=2026-10-31")),
    ).toThrow("Parameter 'from' wajib ditentukan.");

    expect(() =>
      parseCalendarEventsQuery(new URLSearchParams("from=2026-10-01")),
    ).toThrow("Parameter 'to' wajib ditentukan.");
  });

  it("throws ValidationError when date format is invalid", () => {
    expect(() =>
      parseCalendarEventsQuery(
        new URLSearchParams("from=invalid&to=2026-10-31"),
      ),
    ).toThrow("Format tanggal 'from' tidak valid.");
  });

  it("throws ValidationError when from > to", () => {
    expect(() =>
      parseCalendarEventsQuery(
        new URLSearchParams("from=2026-11-01&to=2026-10-01"),
      ),
    ).toThrow("Parameter 'from' tidak boleh lebih besar dari 'to'.");
  });

  it("throws ValidationError when date window exceeds maximum allowed", () => {
    expect(() =>
      parseCalendarEventsQuery(
        new URLSearchParams("from=2026-01-01&to=2026-06-01"),
      ),
    ).toThrow("Rentang kalender melebihi batas maksimum");
  });
});
