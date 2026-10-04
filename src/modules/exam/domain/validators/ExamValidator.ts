import { Result } from "@/core/base/Result";
import { ValidationError } from "@/core/errors/ValidationError";
import type { ReorderQuizQuestionsRequestDto } from "../types/ExamTypes";

export class ReorderQuizQuestionsDtoValidator {
  static validate(
    dto: any,
  ): Result<ReorderQuizQuestionsRequestDto, ValidationError> {
    if (!dto || typeof dto !== "object") {
      return Result.fail(new ValidationError("Invalid request body"));
    }

    if (typeof dto.quizId !== "number") {
      return Result.fail(
        new ValidationError("quizId is required and must be a number"),
      );
    }

    if (!Array.isArray(dto.questions) || dto.questions.length === 0) {
      return Result.fail(
        new ValidationError("questions must be a non-empty array"),
      );
    }

    for (let i = 0; i < dto.questions.length; i++) {
      const q = dto.questions[i];
      if (typeof q.questionId !== "number") {
        return Result.fail(
          new ValidationError(`questions[${i}].questionId must be a number`),
        );
      }
      if (typeof q.slot !== "number") {
        return Result.fail(
          new ValidationError(`questions[${i}].slot must be a number`),
        );
      }
    }

    return Result.ok(dto as ReorderQuizQuestionsRequestDto);
  }
}
