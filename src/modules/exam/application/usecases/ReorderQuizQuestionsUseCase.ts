import type { MoodleClient } from "@/core/moodle/types";
import type { ExamAdministrationRepositoryInterface } from "@/modules/exam/domain/interfaces/ExamAdministrationRepositoryInterface";
import { ReorderQuizQuestionsRequestDto } from "@/modules/exam/domain/types/ExamTypes";
import { ReorderQuizQuestionsDtoValidator } from "@/modules/exam/domain/validators/ExamValidator";

export class ReorderQuizQuestionsUseCase {
  constructor(
    private readonly examRepo: ExamAdministrationRepositoryInterface,
  ) {}

  async execute(client: MoodleClient, dto: any): Promise<void> {
    const validationResult = ReorderQuizQuestionsDtoValidator.validate(dto);
    if (validationResult.isFailure) {
      throw validationResult.getError();
    }

    const validatedDto = validationResult.getValue();
    await this.examRepo.reorderQuizQuestions(
      client,
      validatedDto.quizId,
      validatedDto.questions,
    );
  }
}
