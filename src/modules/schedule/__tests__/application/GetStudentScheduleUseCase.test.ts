import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import { AppRole } from "@/core/rbac/AppRole";
import { GetStudentScheduleUseCase } from "@/modules/schedule/application/usecases/GetStudentScheduleUseCase";
import { ScheduleSessionEntity } from "@/modules/schedule/domain/entity/ScheduleSessionEntity";
import type { ScheduleRepositoryInterface } from "@/modules/schedule/domain/interfaces/ScheduleRepositoryInterface";

describe("GetStudentScheduleUseCase", () => {
  let repository: ScheduleRepositoryInterface;
  let clientFactory: MoodleClientFactory;
  let mockClient: MoodleClient;
  let useCase: GetStudentScheduleUseCase;

  beforeEach(() => {
    mockClient = {
      call: vi.fn(),
    } as unknown as MoodleClient;

    repository = {
      getStudentSchedule: vi.fn(),
      getTenantSchedule: vi.fn(),
      getTeacherSchedule: vi.fn(),
      getSessionById: vi.fn(),
      createSession: vi.fn(),
      updateSession: vi.fn(),
      publishSession: vi.fn(),
      cancelSession: vi.fn(),
    };

    clientFactory = {
      createClientForUser: vi.fn().mockResolvedValue(mockClient),
    } as unknown as MoodleClientFactory;

    useCase = new GetStudentScheduleUseCase(repository, clientFactory);
  });

  it("fails if actor is not STUDENT", async () => {
    const result = await useCase.execute({
      actor: {
        id: "user-1",
        role: AppRole.TENANT,
        tenantId: "tenant-1",
      },
      query: { from: "2026-10-01", to: "2026-10-31" },
      moodleToken: "dummy-token",
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError().message).toContain(
      "hanya dapat diakses oleh siswa",
    );
  });

  it("fails if moodleToken is missing", async () => {
    const result = await useCase.execute({
      actor: {
        id: "user-1",
        role: AppRole.STUDENT,
        tenantId: "tenant-1",
        moodleUserId: 123,
      },
      query: { from: "2026-10-01", to: "2026-10-31" },
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError().message).toContain(
      "Kredensial atau token Moodle siswa wajib",
    );
  });

  it("successfully returns sorted and deduplicated schedule sessions", async () => {
    const session1 = new ScheduleSessionEntity("quiz-1", "tenant-1", {
      id: "quiz-1",
      sessionType: "EXAM",
      title: "Ujian 1",
      startsAt: "2026-10-20T10:00:00.000Z",
      endsAt: "2026-10-20T11:00:00.000Z",
      status: "SCHEDULED",
    });

    const session2 = new ScheduleSessionEntity("quiz-2", "tenant-1", {
      id: "quiz-2",
      sessionType: "EXAM",
      title: "Ujian 2",
      startsAt: "2026-10-15T08:00:00.000Z",
      endsAt: "2026-10-15T09:00:00.000Z",
      status: "SCHEDULED",
    });

    // Provide duplicate of session1 as well
    vi.mocked(repository.getStudentSchedule).mockResolvedValue([
      session1,
      session2,
      session1,
    ]);

    const result = await useCase.execute({
      actor: {
        id: "user-1",
        role: AppRole.STUDENT,
        tenantId: "tenant-1",
        moodleUserId: 123,
      },
      query: { from: "2026-10-01", to: "2026-10-31" },
      moodleToken: "valid-token",
    });

    expect(result.isSuccess).toBe(true);
    const data = result.getValue();
    expect(data.items).toHaveLength(2);
    // Checked sorting: session2 starts on Oct 15, session1 on Oct 20
    expect(data.items[0].id).toBe("quiz-2");
    expect(data.items[1].id).toBe("quiz-1");
  });
});
