import { ValidationError } from "@/core/errors/ValidationError";
import { CreateQuestionRequestDto, QuestionType } from "../types/QuestionTypes";
import { Result } from "@/core/base/Result";

export class CreateQuestionDtoValidator {
  static validate(dto: any): Result<CreateQuestionRequestDto, ValidationError> {
    if (!dto.categoryId || typeof dto.categoryId !== "number") {
      return Result.fail(new ValidationError("Category ID is required and must be a number"));
    }
    if (!dto.name || typeof dto.name !== "string") {
      return Result.fail(new ValidationError("Name is required and must be a string"));
    }
    if (!dto.questionText || typeof dto.questionText !== "string") {
      return Result.fail(new ValidationError("Question text is required"));
    }
    
    const validTypes = Object.values(QuestionType);
    if (!dto.type || !validTypes.includes(dto.type as QuestionType)) {
      return Result.fail(new ValidationError(`Unsupported question type: ${dto.type}`));
    }

    if (dto.defaultMark === undefined || typeof dto.defaultMark !== "number") {
      return Result.fail(new ValidationError("Default mark is required and must be a number"));
    }

    return Result.ok(dto as CreateQuestionRequestDto);
  }
}
