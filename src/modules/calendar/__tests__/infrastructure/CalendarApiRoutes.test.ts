import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpStatus } from "@/core/http/HttpStatus";
import { AppRole } from "@/core/rbac/AppRole";

vi.mock("@/modules/auth/server/getCurrentSession", () => ({
  getCurrentSession: vi.fn(),
}));

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
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";

describe("Calendar API Routes", () => {
  const mockController = getCalendarController();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/calendar/events", () => {
    it("returns 401 UNAUTHORIZED when no actor session exists", async () => {
      vi.mocked(getCurrentSession).mockResolvedValueOnce(null);

      const req = new NextRequest(
        "http://localhost:3000/api/calendar/events?from=2026-10-01&to=2026-10-31",
      );
      const res = await getCalendarEvents(req);
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("UNAUTHORIZED");
      expect(mockController.getEvents).not.toHaveBeenCalled();
    });

    it("delegates to controller when session is authenticated", async () => {
      const session = {
        sessionId: "sess-1",
        actor: {
          userId: "student-1",
          email: "student@example.com",
          role: AppRole.STUDENT,
          tenantId: "tenant-1",
        },
        moodleToken: "student-moodle-token",
      };
      vi.mocked(getCurrentSession).mockResolvedValueOnce(session as any);
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
      expect(mockController.getEvents).toHaveBeenCalledWith(
        session.actor,
        req,
        "student-moodle-token",
      );
    });
  });
});
