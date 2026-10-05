import { describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import { Result } from "@/core/base/Result";
import type { ExamMonitorRepositoryInterface } from "@/modules/exam-monitor/domain/interfaces/ExamMonitorRepositoryInterface";
import { GetExamMonitorUseCase } from "@/modules/exam-monitor/application/usecases/GetExamMonitorUseCase";
import { LockAttemptUseCase } from "@/modules/exam-monitor/application/usecases/LockAttemptUseCase";
import { ForceFinishAttemptUseCase } from "@/modules/exam-monitor/application/usecases/ForceFinishAttemptUseCase";
import { ExtendTimeUseCase } from "@/modules/exam-monitor/application/usecases/ExtendTimeUseCase";

describe("ExamMonitorUseCases", () => {
  const actor = {
    userId: "proctor-1",
    username: "proctor",
    role: AppRole.TENANT,
    permissions: ["exam.monitor.read", "exam.monitor.action"],
    tenantId: "tenant-1",
  };

  const createMockRepo = (): ExamMonitorRepositoryInterface => ({
    getExamMonitor: vi.fn().mockResolvedValue(
      Result.success({
        quizId: 10,
        participants: [],
        totalActive: 0,
        totalFinished: 0,
      }),
    ),
    lockAttempt: vi.fn().mockResolvedValue(Result.success(undefined)),
    unlockAttempt: vi.fn().mockResolvedValue(Result.success(undefined)),
    forceFinishAttempt: vi.fn().mockResolvedValue(Result.success(undefined)),
    extendAttemptTime: vi.fn().mockResolvedValue(Result.success(undefined)),
  });

  describe("GetExamMonitorUseCase", () => {
    it("calls repository getExamMonitor with tenant context", async () => {
      const repo = createMockRepo();
      const usecase = new GetExamMonitorUseCase(repo);
      await usecase.execute(actor, { tenantId: "tenant-1", quizId: 10 });
      expect(repo.getExamMonitor).toHaveBeenCalledWith({
        tenantId: "tenant-1",
        quizId: 10,
      });
    });
  });

  describe("LockAttemptUseCase", () => {
    it("calls repository lockAttempt", async () => {
      const repo = createMockRepo();
      const usecase = new LockAttemptUseCase(repo);
      await usecase.execute(actor, { tenantId: "tenant-1", attemptId: 5 });
      expect(repo.lockAttempt).toHaveBeenCalledWith({
        tenantId: "tenant-1",
        attemptId: 5,
      });
    });
  });

  describe("ForceFinishAttemptUseCase", () => {
    it("calls repository forceFinishAttempt", async () => {
      const repo = createMockRepo();
      const usecase = new ForceFinishAttemptUseCase(repo);
      await usecase.execute(actor, { tenantId: "tenant-1", attemptId: 5 });
      expect(repo.forceFinishAttempt).toHaveBeenCalledWith({
        tenantId: "tenant-1",
        attemptId: 5,
      });
    });
  });

  describe("ExtendTimeUseCase", () => {
    it("calls repository extendAttemptTime", async () => {
      const repo = createMockRepo();
      const usecase = new ExtendTimeUseCase(repo);
      await usecase.execute(actor, { tenantId: "tenant-1", attemptId: 5, extraTimeMinutes: 10 });
      expect(repo.extendAttemptTime).toHaveBeenCalledWith({
        tenantId: "tenant-1",
        attemptId: 5,
        extraTimeMinutes: 10,
      });
    });
  });
});
