import { describe, expect, it } from "vitest";
import type { ReorderQuizQuestionsRequestDto } from "@/modules/exam/domain/types/ExamTypes";
import { ReorderQuizQuestionsDtoValidator } from "@/modules/exam/domain/validators/ExamValidator";

describe("ExamValidator - ReorderQuizQuestionsDtoValidator", () => {
  it("should validate a correct DTO", () => {
    const dto: ReorderQuizQuestionsRequestDto = {
      quizId: 1,
      questions: [
        { questionId: 10, slot: 1 },
        { questionId: 11, slot: 2 },
      ],
    };
    const result = ReorderQuizQuestionsDtoValidator.validate(dto as any);
    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toEqual(dto);
  });

  it("should fail if quizId is missing", () => {
    const dto = {
      questions: [{ questionId: 10, slot: 1 }],
    };
    const result = ReorderQuizQuestionsDtoValidator.validate(dto as any);
    expect(result.isSuccess).toBe(false);
    expect(result.getError()?.message).toContain("quizId");
  });

  it("should fail if questions is empty", () => {
    const dto = {
      quizId: 1,
      questions: [],
    };
    const result = ReorderQuizQuestionsDtoValidator.validate(dto as any);
    expect(result.isSuccess).toBe(false);
    expect(result.getError()?.message).toContain("empty");
  });
});
