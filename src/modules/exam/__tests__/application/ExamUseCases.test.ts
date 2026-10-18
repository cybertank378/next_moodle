import { describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AddQuestionToQuizUseCase } from "@/modules/exam/application/usecases/AddQuestionToQuizUseCase";
import { AddRandomQuestionsToQuizUseCase } from "@/modules/exam/application/usecases/AddRandomQuestionsToQuizUseCase";
import { GetQuizQuestionsUseCase } from "@/modules/exam/application/usecases/GetQuizQuestionsUseCase";
import type { ExamAdministrationRepositoryInterface } from "@/modules/exam/domain/interfaces/ExamAdministrationRepositoryInterface";

const teacherActor: AuthorizationActor = {
  id: "teacher-1",
  role: AppRole.TEACHER,
  tenantId: "tenant-1",
  moodleUserId: 10,
};

const studentActor: AuthorizationActor = {
  id: "student-1",
  role: AppRole.STUDENT,
  tenantId: "tenant-1",
  moodleUserId: 20,
};

describe("ExamUseCases", () => {
  const mockRepo: ExamAdministrationRepositoryInterface = {
    reorderQuizQuestions: vi.fn(),
    addQuestionToQuiz: vi
      .fn()
      .mockResolvedValue({ id: 101, slot: 1, page: 1 }),
    addRandomQuestions: vi.fn().mockResolvedValue(undefined),
    getQuizQuestions: vi.fn().mockResolvedValue([
      {
        id: 1,
        quizId: 5,
        slot: 1,
        page: 1,
        questionId: 42,
        questionName: "Soal 1",
        qtype: "multichoice",
        maxMark: 1.0,
        isRandom: false,
      },
    ]),
  };

  describe("GetQuizQuestionsUseCase", () => {
    it("should get quiz questions when authorized as teacher", async () => {
      const useCase = new GetQuizQuestionsUseCase(mockRepo);
      const result = await useCase.execute({
        actor: teacherActor,
        quizId: 5,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toHaveLength(1);
      expect(result.getValue()[0].questionId).toBe(42);
    });

    it("should fail when unauthorized role attempts access", async () => {
      const useCase = new GetQuizQuestionsUseCase(mockRepo);
      const result = await useCase.execute({
        actor: studentActor,
        quizId: 5,
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toContain("Akses ditolak");
    });

    it("should fail when quizId is invalid", async () => {
      const useCase = new GetQuizQuestionsUseCase(mockRepo);
      const result = await useCase.execute({
        actor: teacherActor,
        quizId: 0,
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toContain("Quiz ID");
    });
  });

  describe("AddQuestionToQuizUseCase", () => {
    it("should add question to quiz successfully", async () => {
      const useCase = new AddQuestionToQuizUseCase(mockRepo);
      const result = await useCase.execute({
        actor: teacherActor,
        quizId: 5,
        questionId: 42,
        maxMark: 2.5,
        page: 1,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().id).toBe(101);
      expect(mockRepo.addQuestionToQuiz).toHaveBeenCalledWith(
        expect.objectContaining({
          tenantId: "tenant-1",
          quizId: 5,
          questionId: 42,
          maxMark: 2.5,
          page: 1,
        }),
      );
    });

    it("should fail when questionId is missing or invalid", async () => {
      const useCase = new AddQuestionToQuizUseCase(mockRepo);
      const result = await useCase.execute({
        actor: teacherActor,
        quizId: 5,
        questionId: 0,
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toContain("Question ID");
    });
  });

  describe("AddRandomQuestionsToQuizUseCase", () => {
    it("should add random questions to quiz successfully", async () => {
      const useCase = new AddRandomQuestionsToQuizUseCase(mockRepo);
      const result = await useCase.execute({
        actor: teacherActor,
        quizId: 5,
        categoryId: 3,
        randomCount: 5,
      });

      expect(result.isSuccess).toBe(true);
      expect(mockRepo.addRandomQuestions).toHaveBeenCalledWith(
        expect.objectContaining({
          tenantId: "tenant-1",
          quizId: 5,
          categoryId: 3,
          randomCount: 5,
        }),
      );
    });

    it("should fail when randomCount is invalid", async () => {
      const useCase = new AddRandomQuestionsToQuizUseCase(mockRepo);
      const result = await useCase.execute({
        actor: teacherActor,
        quizId: 5,
        categoryId: 3,
        randomCount: 0,
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toContain("randomCount");
    });
  });
});
