import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { MoodleClient } from "@/core/moodle/types";
import type { ExamAdministrationRepositoryInterface } from "@/modules/exam/domain/interfaces/ExamAdministrationRepositoryInterface";
import { ReorderQuizQuestionsDtoValidator } from "@/modules/exam/domain/validators/ExamValidator";

export interface ReorderQuizQuestionsInput {
  client: MoodleClient;
  dto: any;
}

export class ReorderQuizQuestionsUseCase extends BaseUseCase<
  ReorderQuizQuestionsInput,
  void
> {
  constructor(
    private readonly examRepo: ExamAdministrationRepositoryInterface,
  ) {
    super();
  }

  override execute(input: ReorderQuizQuestionsInput): Promise<void>;
  override execute(client: MoodleClient, dto: any): Promise<void>;
  override async execute(
    inputOrClient: ReorderQuizQuestionsInput | MoodleClient,
    maybeDto?: any,
  ): Promise<void> {
    const input: ReorderQuizQuestionsInput =
      "client" in inputOrClient && "dto" in inputOrClient
        ? (inputOrClient as ReorderQuizQuestionsInput)
        : { client: inputOrClient as MoodleClient, dto: maybeDto };
    return this.handle(input);
  }

  async handle(input: ReorderQuizQuestionsInput): Promise<void> {
    const validationResult = ReorderQuizQuestionsDtoValidator.validate(
      input.dto,
    );
    if (validationResult.isFailure) {
      throw validationResult.getError();
    }

    const validatedDto = validationResult.getValue();
    await this.examRepo.reorderQuizQuestions(
      input.client,
      validatedDto.quizId,
      validatedDto.questions,
    );
  }
}

