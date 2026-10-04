import { describe, it, expect, vi } from "vitest";
import { CreateQuestionUseCase } from "../../application/usecases/CreateQuestionUseCase";
import { QuestionRepositoryInterface } from "../../domain/interfaces/QuestionRepositoryInterface";
import { QuestionEntity } from "../../domain/entity/QuestionEntity";
import { QuestionType } from "../../domain/types/QuestionTypes";
import { MoodleClient } from "@/core/moodle/types";
import { ValidationError } from "@/core/errors/ValidationError";

describe("CreateQuestionUseCase", () => {
  it("should create a question when dto is valid", async () => {
    const mockEntity = new QuestionEntity(1, {
      categoryId: 10,
      type: QuestionType.MULTICHOICE,
      name: "Q1",
      questionText: "What?",
      defaultMark: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const mockRepo: QuestionRepositoryInterface = {
      getQuestionsByCategory: vi.fn(),
      createQuestion: vi.fn().mockResolvedValue(mockEntity),
      deleteQuestion: vi.fn(),
    };

    const useCase = new CreateQuestionUseCase(mockRepo);
    const mockClient = {} as MoodleClient;

    const result = await useCase.execute(mockClient, {
      categoryId: 10,
      type: QuestionType.MULTICHOICE,
      name: "Q1",
      questionText: "What?",
      defaultMark: 1,
    });

    expect(result.id).toBe(1);
    expect(mockRepo.createQuestion).toHaveBeenCalled();
  });

  it("should throw ValidationError if dto is invalid", async () => {
    const mockRepo: QuestionRepositoryInterface = {
      getQuestionsByCategory: vi.fn(),
      createQuestion: vi.fn(),
      deleteQuestion: vi.fn(),
    };

    const useCase = new CreateQuestionUseCase(mockRepo);
    const mockClient = {} as MoodleClient;

    await expect(useCase.execute(mockClient, {})).rejects.toThrow(ValidationError);
  });
});
