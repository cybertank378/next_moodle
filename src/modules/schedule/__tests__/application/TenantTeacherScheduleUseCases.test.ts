import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import { AppRole } from "@/core/rbac/AppRole";
import { GetTeacherSchedulesUseCase } from "@/modules/schedule/application/usecases/GetTeacherSchedulesUseCase";
import { GetTenantSchedulesUseCase } from "@/modules/schedule/application/usecases/GetTenantSchedulesUseCase";
import {
  CancelScheduleUseCase,
  CreateScheduleUseCase,
  PublishScheduleUseCase,
  UpdateScheduleUseCase,
} from "@/modules/schedule/application/usecases/MutateScheduleUseCases";
import { ScheduleSessionEntity } from "@/modules/schedule/domain/entity/ScheduleSessionEntity";
import type { ScheduleRepositoryInterface } from "@/modules/schedule/domain/interfaces/ScheduleRepositoryInterface";

describe("Tenant & Teacher Schedule Use Cases and RBAC rules", () => {
  let repository: ScheduleRepositoryInterface;
  let clientFactory: MoodleClientFactory;
  let mockClient: MoodleClient;

  beforeEach(() => {
    mockClient = {
      call: vi.fn(),
    } as unknown as MoodleClient;

    repository = {
      getStudentSchedule: vi.fn(),
      getTenantSchedule: vi.fn(),
      getTeacherSchedule: vi.fn(),
      getSessionById: vi.fn(),
    };

    clientFactory = {
      createClientForUser: vi.fn().mockResolvedValue(mockClient),
      createClientForTenant: vi.fn().mockResolvedValue(mockClient),
    } as unknown as MoodleClientFactory;
  });

  describe("GetTenantSchedulesUseCase", () => {
    it("denies access when actor is STUDENT", async () => {
      const useCase = new GetTenantSchedulesUseCase(repository, clientFactory);
      const result = await useCase.execute({
        actor: {
          id: "student-1",
          role: AppRole.STUDENT,
          tenantId: "tenant-1",
        },
        query: { from: "2026-10-01", to: "2026-10-31" },
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toContain(
        "hanya dapat diakses oleh administrator institusi",
      );
    });

    it("succeeds when actor is TENANT", async () => {
      const session = new ScheduleSessionEntity("quiz-1", "tenant-1", {
        id: "quiz-1",
        sessionType: "EXAM",
        title: "Ujian Semester",
        startsAt: "2026-10-15T08:00:00.000Z",
        endsAt: "2026-10-15T10:00:00.000Z",
        status: "SCHEDULED",
      });

      vi.mocked(repository.getTenantSchedule).mockResolvedValue([session]);

      const useCase = new GetTenantSchedulesUseCase(repository, clientFactory);
      const result = await useCase.execute({
        actor: {
          id: "tenant-admin",
          role: AppRole.TENANT,
          tenantId: "tenant-1",
        },
        query: { from: "2026-10-01", to: "2026-10-31" },
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().items).toHaveLength(1);
    });
  });

  describe("GetTeacherSchedulesUseCase", () => {
    it("denies access when actor is not TEACHER", async () => {
      const useCase = new GetTeacherSchedulesUseCase(repository, clientFactory);
      const result = await useCase.execute({
        actor: {
          id: "student-1",
          role: AppRole.STUDENT,
          tenantId: "tenant-1",
        },
        query: { from: "2026-10-01", to: "2026-10-31" },
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toContain(
        "hanya dapat diakses oleh guru",
      );
    });

    it("succeeds when actor is TEACHER with token", async () => {
      const session = new ScheduleSessionEntity("quiz-2", "tenant-1", {
        id: "quiz-2",
        sessionType: "EXAM",
        title: "Ujian Fisika",
        startsAt: "2026-10-16T08:00:00.000Z",
        endsAt: "2026-10-16T10:00:00.000Z",
        status: "SCHEDULED",
      });

      vi.mocked(repository.getTeacherSchedule).mockResolvedValue([session]);

      const useCase = new GetTeacherSchedulesUseCase(repository, clientFactory);
      const result = await useCase.execute({
        actor: {
          id: "teacher-1",
          role: AppRole.TEACHER,
          tenantId: "tenant-1",
          moodleUserId: 20,
        },
        query: { from: "2026-10-01", to: "2026-10-31" },
        moodleToken: "teacher-token",
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().items).toHaveLength(1);
    });
  });

  describe("MutateScheduleUseCases (Strict Student Forbidden & Backend-Block Contract)", () => {
    it("returns 403 Forbidden when STUDENT attempts CreateSchedule", async () => {
      const useCase = new CreateScheduleUseCase();
      const result = await useCase.execute({
        actor: {
          id: "student-1",
          role: AppRole.STUDENT,
          tenantId: "tenant-1",
        },
        data: {
          title: "Sesi Ilegal",
          sessionType: "LESSON",
          courseId: 10,
          startsAt: "2026-10-20T08:00:00Z",
          endsAt: "2026-10-20T09:00:00Z",
        },
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toContain("Siswa tidak memiliki izin");
    });

    it("returns 403 Forbidden when STUDENT attempts UpdateSchedule", async () => {
      const useCase = new UpdateScheduleUseCase();
      const result = await useCase.execute({
        actor: {
          id: "student-1",
          role: AppRole.STUDENT,
          tenantId: "tenant-1",
        },
        sessionId: "quiz-1",
        data: { title: "Ganti Judul" },
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toContain("Siswa tidak memiliki izin");
    });

    it("returns 403 Forbidden when STUDENT attempts PublishSchedule", async () => {
      const useCase = new PublishScheduleUseCase();
      const result = await useCase.execute({
        actor: {
          id: "student-1",
          role: AppRole.STUDENT,
          tenantId: "tenant-1",
        },
        sessionId: "quiz-1",
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toContain("Siswa tidak memiliki izin");
    });

    it("returns 403 Forbidden when STUDENT attempts CancelSchedule", async () => {
      const useCase = new CancelScheduleUseCase();
      const result = await useCase.execute({
        actor: {
          id: "student-1",
          role: AppRole.STUDENT,
          tenantId: "tenant-1",
        },
        sessionId: "quiz-1",
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toContain("Siswa tidak memiliki izin");
    });

    it("returns backend-contract-blocked message when TENANT attempts mutations", async () => {
      const createUseCase = new CreateScheduleUseCase();
      const res = await createUseCase.execute({
        actor: {
          id: "tenant-1",
          role: AppRole.TENANT,
          tenantId: "tenant-1",
        },
        data: {
          title: "Sesi Matematika",
          sessionType: "LESSON",
          courseId: 10,
          startsAt: "2026-10-20T08:00:00Z",
          endsAt: "2026-10-20T09:00:00Z",
        },
      });

      expect(res.isFailure).toBe(true);
      expect(res.getError().message).toContain("backend-contract-blocked");
    });
  });
});
