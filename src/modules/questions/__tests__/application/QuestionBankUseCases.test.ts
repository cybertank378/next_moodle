import { describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { CreateQuestionCategoryUseCase } from "@/modules/questions/application/usecases/CreateQuestionCategoryUseCase";
import { GetQuestionCategoriesUseCase } from "@/modules/questions/application/usecases/GetQuestionCategoriesUseCase";
import { GetQuestionsUseCase } from "@/modules/questions/application/usecases/GetQuestionsUseCase";
import type { QuestionRepositoryInterface } from "@/modules/questions/domain/interfaces/QuestionRepositoryInterface";

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

describe("QuestionBankUseCases", () => {
  const mockRepo: QuestionRepositoryInterface = {
    getQuestionsByCategory: vi.fn(),
    getQuestions: vi.fn().mockResolvedValue({
      total: 1,
      page: 1,
      limit: 10,
      questions: [
        {
          id: 1,
          categoryId: 2,
          type: "multichoice",
          name: "Soal Aljabar",
          questionText: "Berapakah 2x + 3 = 7?",
          defaultMark: 1,
        },
      ],
    }),
    getQuestionCategories: vi.fn().mockResolvedValue([
      {
        id: 2,
        name: "Aljabar",
        contextId: 1,
        parent: 0,
        questionCount: 5,
      },
    ]),
    createQuestionCategory: vi.fn().mockResolvedValue({
      id: 3,
      name: "Geometri",
      contextId: 1,
      parent: 0,
      questionCount: 0,
    }),
    createQuestion: vi.fn(),
    updateQuestion: vi.fn(),
    deleteQuestion: vi.fn(),
  };

  describe("GetQuestionsUseCase", () => {
    it("should return questions when authorized as teacher", async () => {
      const useCase = new GetQuestionsUseCase(mockRepo);
      const result = await useCase.execute({
        actor: teacherActor,
        categoryId: 2,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().questions).toHaveLength(1);
    });

    it("should fail when unauthorized role attempts access", async () => {
      const useCase = new GetQuestionsUseCase(mockRepo);
      const result = await useCase.execute({
        actor: studentActor,
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toContain("Akses ditolak");
    });
  });

  describe("GetQuestionCategoriesUseCase", () => {
    it("should return categories when authorized as teacher", async () => {
      const useCase = new GetQuestionCategoriesUseCase(mockRepo);
      const result = await useCase.execute({
        actor: teacherActor,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toHaveLength(1);
      expect(result.getValue()[0].name).toBe("Aljabar");
    });
  });

  describe("CreateQuestionCategoryUseCase", () => {
    it("should create category when input is valid", async () => {
      const useCase = new CreateQuestionCategoryUseCase(mockRepo);
      const result = await useCase.execute({
        actor: teacherActor,
        name: "Geometri",
        contextId: 1,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().name).toBe("Geometri");
    });

    it("should fail when name is empty", async () => {
      const useCase = new CreateQuestionCategoryUseCase(mockRepo);
      const result = await useCase.execute({
        actor: teacherActor,
        name: "   ",
        contextId: 1,
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError().message).toContain("tidak boleh kosong");
    });
  });
});
