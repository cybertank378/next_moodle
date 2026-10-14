import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpStatus } from "@/core/http/HttpStatus";

vi.mock("@/app/api/calendar/_factory", () => {
  const mockController = {
    getEvents: vi.fn(),
  };
  return {
    getCalendarController: () => mockController,
  };
});

import { getCalendarController } from "@/app/api/calendar/_factory";
import { GET as getCalendarEvents } from "@/app/api/calendar/events/route";

describe("Calendar API Routes", () => {
  const mockController = getCalendarController();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/calendar/events", () => {
    it("delegates to controller directly", async () => {
      vi.mocked(mockController.getEvents).mockResolvedValueOnce(
        NextResponse.json({
          success: true,
          data: {
            items: [],
            range: { from: "2026-10-01", to: "2026-10-31" },
            meta: { total: 0, supportedTypes: ["QUIZ_EXAM"] },
          },
        }),
      );

      const req = new NextRequest(
        "http://localhost:3000/api/calendar/events?from=2026-10-01&to=2026-10-31",
      );
      const res = await getCalendarEvents(req);
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.OK);
      expect(json.success).toBe(true);
      expect(mockController.getEvents).toHaveBeenCalledWith(req);
    });
  });
});
