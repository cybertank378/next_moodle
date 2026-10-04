import { Result } from "@/core/base/Result";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { ValidationError } from "@/core/errors/ValidationError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { QuizAccessResponseDTO } from "@/modules/quiz/domain/dto/QuizResponseDto";
import type { QuizRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizRepositoryInterface";
import { QuizMapper } from "@/modules/quiz/domain/mapper/QuizMapper";
import { authorizeQuizOperation } from "@/modules/quiz/application/services/QuizAuthorizationService";

export interface CheckQuizAccessInput {
  actor: AuthorizationActor | null | undefined;
  quizId: number;
  tenantId?: string;
  courseId?: number;
  currentTime?: number;
}

export class CheckQuizAccessUseCase {
  constructor(private readonly repository: QuizRepositoryInterface) {}

  async execute(
    input: CheckQuizAccessInput,
  ): Promise<Result<QuizAccessResponseDTO, Error>> {
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
        new ValidationError("Tenant ID wajib ditentukan untuk mengakses kuis."),
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

      // Evaluate time-based access rule
      const timeEvaluation = quiz.evaluateAccess(input.currentTime);

      // If time-based check is already closed or upcoming, return it
      if (!timeEvaluation.isAllowed) {
        return Result.ok(QuizMapper.toAccessDTO(quiz, timeEvaluation));
      }

      // Check external Moodle access rules if available
      const moodleAccess = await this.repository.getQuizAccessInfo({
        tenantId: effectiveTenantId,
        quizId: quiz.id,
      });

      if (moodleAccess && moodleAccess.canattempt === false) {
        const reasons = moodleAccess.preventaccessreasons?.length
          ? moodleAccess.preventaccessreasons
          : ["Akses kuis tidak diizinkan oleh Moodle."];

        return Result.ok(
          QuizMapper.toAccessDTO(quiz, {
            isAllowed: false,
            status: "CLOSED",
            reasons,
          }),
        );
      }

      return Result.ok(QuizMapper.toAccessDTO(quiz, timeEvaluation));
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
