import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { MoodleClient } from "@/core/moodle/types";
import type { QuestionEntity } from "@/modules/questions/domain/entity/QuestionEntity";
import type { QuestionRepositoryInterface } from "@/modules/questions/domain/interfaces/QuestionRepositoryInterface";
import type { UpdateQuestionRequestDto } from "@/modules/questions/domain/types/QuestionTypes";
import { UpdateQuestionDtoValidator } from "@/modules/questions/domain/validators/QuestionValidator";

export interface UpdateQuestionInput {
  client: MoodleClient;
  questionId: number;
  dto: Record<string, unknown> | null;
}

export class UpdateQuestionUseCase extends BaseUseCase<
  UpdateQuestionInput,
  QuestionEntity
> {
  constructor(private readonly questionRepo: QuestionRepositoryInterface) {
    super();
  }

  override execute(input: UpdateQuestionInput): Promise<QuestionEntity>;
  override execute(
    client: MoodleClient,
    questionId: number,
    dto: Record<string, unknown> | null,
  ): Promise<QuestionEntity>;
  override async execute(
    inputOrClient: UpdateQuestionInput | MoodleClient,
    maybeQuestionId?: number,
    maybeDto?: Record<string, unknown> | null,
  ): Promise<QuestionEntity> {
    const input: UpdateQuestionInput =
      "client" in inputOrClient && "questionId" in inputOrClient
        ? (inputOrClient as UpdateQuestionInput)
        : {
            client: inputOrClient as MoodleClient,
            questionId: maybeQuestionId!,
            dto: maybeDto ?? null,
          };
    return this.handle(input);
  }

  async handle(input: UpdateQuestionInput): Promise<QuestionEntity> {
    const validationResult = UpdateQuestionDtoValidator.validate(input.dto);
    if (!validationResult.isSuccess) {
      throw validationResult.getError();
    }

    const validDto = validationResult.getValue() as UpdateQuestionRequestDto;
    return await this.questionRepo.updateQuestion(
      input.client,
      input.questionId,
      validDto,
    );
  }
}

