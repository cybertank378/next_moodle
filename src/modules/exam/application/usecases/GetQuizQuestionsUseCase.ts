import { BaseUseCase } from "@/core/base/BaseUseCase";
import { Result } from "@/core/base/Result";
import { ValidationError } from "@/core/errors/ValidationError";
import type { MoodleClient } from "@/core/moodle/types";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import { authorizeExamOperation } from "@/modules/exam/application/services/ExamAuthorizationService";
import type {
  ExamAdministrationRepositoryInterface,
  QuizQuestionSlot,
} from "@/modules/exam/domain/interfaces/ExamAdministrationRepositoryInterface";

export interface GetQuizQuestionsInput {
  actor: AuthorizationActor | null | undefined;
  quizId: number;
  tenantId?: string;
  client?: MoodleClient;
}

export class GetQuizQuestionsUseCase extends BaseUseCase<
  GetQuizQuestionsInput,
  Result<QuizQuestionSlot[], Error>
> {
  constructor(
    private readonly repository: ExamAdministrationRepositoryInterface,
  ) {
    super();
  }

  async handle(
    input: GetQuizQuestionsInput,
  ): Promise<Result<QuizQuestionSlot[], Error>> {
    const authError = authorizeExamOperation(input.actor, Permission.QUIZ_READ);
    if (authError) return Result.fail(authError);

    if (!input.quizId || input.quizId <= 0) {
      return Result.fail(
        new ValidationError("Quiz ID harus berupa angka positif yang valid."),
      );
    }

    const effectiveTenantId = input.actor?.tenantId || input.tenantId;
    if (!effectiveTenantId) {
      return Result.fail(
        new ValidationError(
          "Tenant ID wajib ditentukan untuk mengambil daftar soal kuis.",
        ),
      );
    }

    try {
      const slots = await this.repository.getQuizQuestions({
        tenantId: effectiveTenantId,
        quizId: input.quizId,
        client: input.client,
      });

      return Result.ok(slots);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
