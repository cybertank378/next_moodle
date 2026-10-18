import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { MoodleClient } from "@/core/moodle/types";
import type { QuestionEntity } from "@/modules/questions/domain/entity/QuestionEntity";
import type { QuestionRepositoryInterface } from "@/modules/questions/domain/interfaces/QuestionRepositoryInterface";
import { CreateQuestionDtoValidator } from "@/modules/questions/domain/validators/QuestionValidator";

export interface CreateQuestionInput {
  client: MoodleClient;
  dto: Record<string, unknown> | null;
}

export class CreateQuestionUseCase extends BaseUseCase<
  CreateQuestionInput,
  QuestionEntity
> {
  constructor(private readonly repository: QuestionRepositoryInterface) {
    super();
  }

  override execute(input: CreateQuestionInput): Promise<QuestionEntity>;
  override execute(
    client: MoodleClient,
    dto: Record<string, unknown> | null,
  ): Promise<QuestionEntity>;
  override async execute(
    inputOrClient: CreateQuestionInput | MoodleClient,
    maybeDto?: Record<string, unknown> | null,
  ): Promise<QuestionEntity> {
    const input: CreateQuestionInput =
      "client" in inputOrClient && "dto" in inputOrClient
        ? (inputOrClient as CreateQuestionInput)
        : {
            client: inputOrClient as MoodleClient,
            dto: maybeDto ?? null,
          };
    return this.handle(input);
  }

  async handle(input: CreateQuestionInput): Promise<QuestionEntity> {
    const validationResult = CreateQuestionDtoValidator.validate(input.dto);
    if (validationResult.isFailure) {
      throw validationResult.getError();
    }
    const validDto = validationResult.getValue();
    return this.repository.createQuestion(input.client, validDto);
  }
}

