import type { MoodleClient } from "@/core/moodle/types";
import type { QuestionEntity } from "@/modules/questions/domain/entity/QuestionEntity";
import type { QuestionRepositoryInterface } from "@/modules/questions/domain/interfaces/QuestionRepositoryInterface";
import type { UpdateQuestionRequestDto } from "@/modules/questions/domain/types/QuestionTypes";
import { UpdateQuestionDtoValidator } from "@/modules/questions/domain/validators/QuestionValidator";

export class UpdateQuestionUseCase {
  constructor(private readonly questionRepo: QuestionRepositoryInterface) {}

  async execute(
    client: MoodleClient,
    questionId: number,
    dto: any,
  ): Promise<QuestionEntity> {
    const validationResult = UpdateQuestionDtoValidator.validate(dto);
    if (!validationResult.isSuccess) {
      throw validationResult.getError();
    }

    const validDto = validationResult.getValue() as UpdateQuestionRequestDto;
    return await this.questionRepo.updateQuestion(client, questionId, validDto);
  }
}
