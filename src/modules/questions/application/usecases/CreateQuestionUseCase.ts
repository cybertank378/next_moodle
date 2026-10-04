import type { MoodleClient } from "@/core/moodle/types";
import type { QuestionEntity } from "@/modules/questions/domain/entity/QuestionEntity";
import type { QuestionRepositoryInterface } from "@/modules/questions/domain/interfaces/QuestionRepositoryInterface";
import { CreateQuestionRequestDto } from "@/modules/questions/domain/types/QuestionTypes";
import { CreateQuestionDtoValidator } from "@/modules/questions/domain/validators/QuestionValidator";

export class CreateQuestionUseCase {
  constructor(private readonly repository: QuestionRepositoryInterface) {}

  async execute(
    client: MoodleClient,
    dto: Record<string, unknown> | null,
  ): Promise<QuestionEntity> {
    const validationResult = CreateQuestionDtoValidator.validate(dto);
    if (validationResult.isFailure) {
      throw validationResult.getError();
    }
    const validDto = validationResult.getValue();
    return this.repository.createQuestion(client, validDto);
  }
}
