import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import AttemptTimer, { formatTimerDisplay } from "@/sections/exam/atoms/AttemptTimer";

describe("AttemptTimer (RED -> GREEN)", () => {
  it("formats time display into HH:MM:SS when duration is 1 hour or more", () => {
    // 3665 seconds = 1 hour, 1 minute, 5 seconds
    expect(formatTimerDisplay(3665)).toBe("01:01:05");
  });

  it("formats time display into MM:SS when under 1 hour", () => {
    // 300 seconds = 5 minutes
    expect(formatTimerDisplay(300)).toBe("05:00");
    expect(formatTimerDisplay(55)).toBe("00:55");
    expect(formatTimerDisplay(0)).toBe("00:00");
  });

  it("renders remaining time correctly formatted into DOM", () => {
    const html = renderToStaticMarkup(<AttemptTimer seconds={3665} />);
    expect(html).toContain("01:01:05");
  });

  it("renders warning styling when seconds is below warningThresholdSeconds", () => {
    const html = renderToStaticMarkup(
      <AttemptTimer seconds={120} warningThresholdSeconds={300} />,
    );
    expect(html).toContain("02:00");
    expect(html).toContain('data-warning="true"');
  });

  it("does not render warning styling when time is above threshold", () => {
    const html = renderToStaticMarkup(
      <AttemptTimer seconds={600} warningThresholdSeconds={300} />,
    );
    expect(html).toContain("10:00");
    expect(html).toContain('data-warning="false"');
  });
});
