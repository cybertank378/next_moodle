import type { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { Result } from "@/core/base/Result";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { AppRole } from "@/core/rbac/AppRole";
import type { GetStudentCalendarEventsUseCase } from "@/modules/calendar/application/usecases/GetStudentCalendarEventsUseCase";
import { CalendarController } from "@/modules/calendar/infrastructure/http/CalendarController";

describe("CalendarController", () => {
  const studentActor: CurrentActor = {
    userId: "student-1",
    email: "student@example.com",
    role: AppRole.STUDENT,
    tenantId: "tenant-1",
    moodleUserId: 10,
  } as any;

  it("returns 200 with calendar events on successful execution", async () => {
    const mockUseCase = {
      execute: vi.fn().mockResolvedValue(
        Result.ok({
          items: [
            {
              id: "quiz-1",
              sourceType: "QUIZ_EXAM",
              title: "Ujian Matematika",
              startAt: "2026-10-15T08:00:00Z",
              endAt: "2026-10-15T10:00:00Z",
              allDay: false,
            },
          ],
          range: { from: "2026-10-01", to: "2026-10-31" },
          meta: { total: 1, supportedTypes: ["QUIZ_EXAM"] },
        }),
      ),
    } as unknown as GetStudentCalendarEventsUseCase;

    const controller = new CalendarController(mockUseCase);
    const mockReq = {
      nextUrl: {
        searchParams: new URLSearchParams("from=2026-10-01&to=2026-10-31"),
      },
    } as unknown as NextRequest;

    const response = await controller.getEvents(
      studentActor,
      mockReq,
      "moodle-token",
    );
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.items).toHaveLength(1);
    expect(body.data.items[0].title).toBe("Ujian Matematika");
  });

  it("maps error to 403 when usecase fails with ForbiddenError", async () => {
    const mockUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue(Result.fail(new ForbiddenError("Akses ditolak."))),
    } as unknown as GetStudentCalendarEventsUseCase;

    const controller = new CalendarController(mockUseCase);
    const mockReq = {
      nextUrl: {
        searchParams: new URLSearchParams("from=2026-10-01&to=2026-10-31"),
      },
    } as unknown as NextRequest;

    const response = await controller.getEvents(studentActor, mockReq);
    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("FORBIDDEN");
  });
});
