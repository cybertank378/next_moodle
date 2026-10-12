import { describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { GetStudentCalendarEventsUseCase } from "@/modules/calendar/application/usecases/GetStudentCalendarEventsUseCase";
import { CalendarEventEntity } from "@/modules/calendar/domain/entity/CalendarEventEntity";
import type { CalendarRepositoryInterface } from "@/modules/calendar/domain/interfaces/CalendarRepositoryInterface";

const validStudentActor: AuthorizationActor = {
  id: "student-1",
  role: AppRole.STUDENT,
  tenantId: "tenant-1",
  moodleUserId: 42,
};

const tenantActor: AuthorizationActor = {
  id: "tenant-1",
  role: AppRole.TENANT,
  tenantId: "tenant-1",
};

describe("GetStudentCalendarEventsUseCase", () => {
  const mockRepo: CalendarRepositoryInterface = {
    getStudentCalendarEvents: vi.fn(),
  };
  const mockClientFactory = {
    createClientForUser: vi.fn(),
    createClientForTenant: vi.fn(),
  };

  it("fails closed when actor is not STUDENT", async () => {
    const useCase = new GetStudentCalendarEventsUseCase(
      mockRepo,
      mockClientFactory as any,
    );

    const result = await useCase.execute({
      actor: tenantActor,
      query: { from: "2026-10-01", to: "2026-10-31" },
      moodleToken: "token-1",
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError().message).toMatch(
      /hanya dapat diakses oleh siswa/i,
    );
  });

  it("fails closed when actor has no tenantId or moodleUserId", async () => {
    const useCase = new GetStudentCalendarEventsUseCase(
      mockRepo,
      mockClientFactory as any,
    );

    const result = await useCase.execute({
      actor: { ...validStudentActor, tenantId: null },
      query: { from: "2026-10-01", to: "2026-10-31" },
      moodleToken: "token-1",
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError().message).toMatch(/tenant id/i);
  });

  it("fails closed when student moodle token is missing", async () => {
    const useCase = new GetStudentCalendarEventsUseCase(
      mockRepo,
      mockClientFactory as any,
    );

    const result = await useCase.execute({
      actor: validStudentActor,
      query: { from: "2026-10-01", to: "2026-10-31" },
      // no moodleToken
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError().message).toMatch(/kredensial atau token moodle/i);
  });

  it("successfully fetches, deduplicates, and sorts calendar events for valid student", async () => {
    const mockClient = { call: vi.fn() };
    mockClientFactory.createClientForUser.mockResolvedValue(mockClient);

    const event1 = new CalendarEventEntity("quiz-2", "tenant-1", {
      id: "quiz-2",
      sourceType: "QUIZ_EXAM",
      title: "Quiz 2",
      startAt: "2026-10-20T10:00:00.000Z",
      endAt: "2026-10-20T11:00:00.000Z",
      allDay: false,
    });
    const event2 = new CalendarEventEntity("quiz-1", "tenant-1", {
      id: "quiz-1",
      sourceType: "QUIZ_EXAM",
      title: "Quiz 1",
      startAt: "2026-10-10T08:00:00.000Z",
      endAt: "2026-10-10T09:00:00.000Z",
      allDay: false,
    });
    const duplicateEvent1 = new CalendarEventEntity("quiz-2", "tenant-1", {
      id: "quiz-2",
      sourceType: "QUIZ_EXAM",
      title: "Quiz 2 Duplicate",
      startAt: "2026-10-20T10:00:00.000Z",
      endAt: "2026-10-20T11:00:00.000Z",
      allDay: false,
    });

    vi.mocked(mockRepo.getStudentCalendarEvents).mockResolvedValue([
      event1,
      duplicateEvent1,
      event2,
    ]);

    const useCase = new GetStudentCalendarEventsUseCase(
      mockRepo,
      mockClientFactory as any,
    );

    const result = await useCase.execute({
      actor: validStudentActor,
      query: { from: "2026-10-01", to: "2026-10-31", types: ["QUIZ_EXAM"] },
      moodleToken: "valid-student-token",
    });

    expect(result.isSuccess).toBe(true);
    const data = result.getValue();
    expect(data.items).toHaveLength(2); // deduped
    expect(data.items[0].id).toBe("quiz-1"); // sorted ascending by startAt
    expect(data.items[1].id).toBe("quiz-2");
    expect(data.meta.total).toBe(2);
    expect(mockClientFactory.createClientForUser).toHaveBeenCalledWith(
      { tenantId: "tenant-1", tenantSlug: "tenant-1", status: "ACTIVE" },
      "valid-student-token",
    );
  });
});
