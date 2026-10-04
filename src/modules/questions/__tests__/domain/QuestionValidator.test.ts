import { describe, it, expect } from "vitest";
import { CreateQuestionDtoValidator } from "../../domain/validators/QuestionValidator";
import { QuestionType } from "../../domain/types/QuestionTypes";

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
