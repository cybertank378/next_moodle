import { describe, expect, it } from "vitest";
import type { QuestionType } from "../../domain/types/QuestionTypes";
import { CreateQuestionDtoValidator } from "../../domain/validators/QuestionValidator";

describe("CreateQuestionDtoValidator", () => {
  it("should fail when question type is not supported", () => {
    const invalidDto = {
      categoryId: 1,
      name: "Test Q",
      questionText: "What is 1+1?",
      type: "unsupported_type" as QuestionType,
      defaultMark: 1,
      options: [],
    };

    const result = CreateQuestionDtoValidator.validate(invalidDto);
    expect(result.isSuccess).toBe(false);
    if (result.isFailure) {
      expect(result.getError().message).toContain("Unsupported question type");
    }
  });
});
