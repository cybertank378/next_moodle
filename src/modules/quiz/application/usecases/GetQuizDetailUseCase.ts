import { Result } from "@/core/base/Result";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { ValidationError } from "@/core/errors/ValidationError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { authorizeQuizOperation } from "@/modules/quiz/application/services/QuizAuthorizationService";
import type { QuizSummaryResponseDTO } from "@/modules/quiz/domain/dto/QuizResponseDto";
import type { QuizRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizRepositoryInterface";
import { QuizMapper } from "@/modules/quiz/domain/mapper/QuizMapper";

export interface GetQuizDetailInput {
  actor: AuthorizationActor | null | undefined;
  quizId: number;
  tenantId?: string;
  courseId?: number;
}

export class GetQuizDetailUseCase {
  constructor(private readonly repository: QuizRepositoryInterface) {}

  async execute(
    input: GetQuizDetailInput,
  ): Promise<Result<QuizSummaryResponseDTO, Error>> {
    const authError = authorizeQuizOperation(input.actor);
    if (authError) return Result.fail(authError);

    const actor = input.actor;
    if (!actor) {
      return Result.fail(
        new ValidationError("Sesi tidak valid atau telah berakhir."),
      );
    }

    const effectiveTenantId = actor.tenantId || input.tenantId;
    if (!effectiveTenantId) {
      return Result.fail(
        new ValidationError(
          "Tenant ID wajib ditentukan untuk melihat detail ujian.",
        ),
      );
    }

    if (!input.quizId || input.quizId <= 0) {
      return Result.fail(
        new ValidationError("Parameter quizId harus berupa angka positif."),
      );
    }

    try {
      const quiz = await this.repository.getQuizById({
        tenantId: effectiveTenantId,
        quizId: input.quizId,
        courseId: input.courseId,
      });

      if (!quiz) {
        return Result.fail(
          new NotFoundError(`Kuis dengan ID ${input.quizId} tidak ditemukan.`),
        );
      }

      return Result.ok(QuizMapper.toSummaryDTO(quiz));
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
