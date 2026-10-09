import { describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { CheckQuizAccessUseCase } from "@/modules/quiz/application/usecases/CheckQuizAccessUseCase";
import { GetQuizDetailUseCase } from "@/modules/quiz/application/usecases/GetQuizDetailUseCase";
import { GetQuizzesByCourseUseCase } from "@/modules/quiz/application/usecases/GetQuizzesByCourseUseCase";
import { QuizEntity } from "@/modules/quiz/domain/entity/QuizEntity";
import type { QuizRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizRepositoryInterface";

const studentActor: AuthorizationActor = {
  id: "student-1",
  role: AppRole.STUDENT,
  tenantId: "tenant-1",
  moodleUserId: 42,
};

const tenantActor: AuthorizationActor = {
  id: "tenant-admin-1",
  role: AppRole.TENANT,
  tenantId: "tenant-1",
};

function createMockQuiz(id: number, name: string): QuizEntity {
  return new QuizEntity(id, "tenant-1", {
    id,
    courseId: 10,
    courseModuleId: 100 + id,
    name,
    intro: "Deskripsi Ujian",
    timeOpen: 1700000000,
    timeClose: 1700010000,
    timeLimitSeconds: 3600,
    maxAttempts: 1,
    grade: 100,
    isVisible: true,
  });
}

class MockQuizRepository implements QuizRepositoryInterface {
  getQuizzesByCourses = vi.fn<QuizRepositoryInterface["getQuizzesByCourses"]>();
  getQuizById = vi.fn<QuizRepositoryInterface["getQuizById"]>();
  getQuizAccessInfo = vi.fn<QuizRepositoryInterface["getQuizAccessInfo"]>();
}

describe("Quiz Application Use Cases", () => {
  describe("GetQuizzesByCourseUseCase", () => {
    it("returns list of quizzes matching courseId and search query", async () => {
      const repo = new MockQuizRepository();
      repo.getQuizzesByCourses.mockResolvedValue([
        createMockQuiz(1, "Kuis Aljabar Linear"),
        createMockQuiz(2, "Kuis Kalkulus"),
      ]);

      const useCase = new GetQuizzesByCourseUseCase(repo);
      const result = await useCase.execute({
        actor: studentActor,
        courseId: 10,
        search: "kalkulus",
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.total).toBe(1);
      expect(data.quizzes[0].name).toBe("Kuis Kalkulus");
      expect(repo.getQuizzesByCourses).toHaveBeenCalledWith({
        tenantId: "tenant-1",
        courseIds: [10],
      });
    });

    it("fails when actor has no tenantId", async () => {
      const repo = new MockQuizRepository();
      const useCase = new GetQuizzesByCourseUseCase(repo);

      const result = await useCase.execute({
        actor: { id: "user", role: AppRole.STUDENT, tenantId: null },
      });

      expect(result.isFailure).toBe(true);
    });
  });

  describe("GetQuizDetailUseCase", () => {
    it("returns quiz detail when found", async () => {
      const repo = new MockQuizRepository();
      repo.getQuizById.mockResolvedValue(createMockQuiz(5, "Ujian Kimia"));

      const useCase = new GetQuizDetailUseCase(repo);
      const result = await useCase.execute({
        actor: tenantActor,
        quizId: 5,
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.id).toBe(5);
      expect(data.name).toBe("Ujian Kimia");
    });

    it("fails when quiz is not found", async () => {
      const repo = new MockQuizRepository();
      repo.getQuizById.mockResolvedValue(null);

      const useCase = new GetQuizDetailUseCase(repo);
      const result = await useCase.execute({
        actor: studentActor,
        quizId: 999,
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toMatch(/tidak ditemukan/i);
    });
  });

  describe("CheckQuizAccessUseCase", () => {
    it("returns UPCOMING status when current time is before timeopen", async () => {
      const repo = new MockQuizRepository();
      repo.getQuizById.mockResolvedValue(createMockQuiz(10, "Ujian Geografi"));
      repo.getQuizAccessInfo.mockResolvedValue(null);

      const useCase = new CheckQuizAccessUseCase(repo);
      const result = await useCase.execute({
        actor: studentActor,
        quizId: 10,
        currentTime: 1699999000, // before 1700000000
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.canAttempt).toBe(false);
      expect(data.status).toBe("UPCOMING");
      expect(data.reasons[0]).toMatch(/belum dibuka/i);
    });

    it("respects Moodle preventaccessreasons if external access info disallows attempt", async () => {
      const repo = new MockQuizRepository();
      repo.getQuizById.mockResolvedValue(createMockQuiz(10, "Ujian Fisika"));
      repo.getQuizAccessInfo.mockResolvedValue({
        canattempt: false,
        preventaccessreasons: ["Anda telah mencapai batas maksimum percobaan."],
      });

      const useCase = new CheckQuizAccessUseCase(repo);
      const result = await useCase.execute({
        actor: studentActor,
        quizId: 10,
        currentTime: 1700005000, // within time window
      });

      expect(result.isSuccess).toBe(true);
      const data = result.getValue();
      expect(data.canAttempt).toBe(false);
      expect(data.reasons[0]).toContain("batas maksimum percobaan");
    });
  });
});
