import type { MoodleClient } from "@/core/moodle/types";
import type { ExamAdministrationRepositoryInterface } from "../../domain/interfaces/ExamAdministrationRepositoryInterface";
import { ReorderQuizQuestionsRequestDto } from "../../domain/types/ExamTypes";
import { ReorderQuizQuestionsDtoValidator } from "../../domain/validators/ExamValidator";

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
