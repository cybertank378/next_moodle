import type { MoodleClient } from "@/core/moodle/types";
import type { QuestionEntity } from "../../domain/entity/QuestionEntity";
import type { QuestionRepositoryInterface } from "../../domain/interfaces/QuestionRepositoryInterface";
import { CreateQuestionRequestDto } from "../../domain/types/QuestionTypes";
import { CreateQuestionDtoValidator } from "../../domain/validators/QuestionValidator";

export class CreateQuestionUseCase {
  constructor(private readonly repository: QuestionRepositoryInterface) {}

  async execute(client: MoodleClient, dto: unknown): Promise<QuestionEntity> {
    const validationResult = CreateQuestionDtoValidator.validate(dto);
    if (validationResult.isFailure) {
      throw validationResult.getError();
    }
    const validDto = validationResult.getValue();
    return this.repository.createQuestion(client, validDto);
  }
}
