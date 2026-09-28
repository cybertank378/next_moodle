import { Result } from "@/core/base/Result";
import { ValidationError } from "@/core/errors/ValidationError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { QuizListResponseDTO } from "../../domain/dto/QuizResponseDto";
import type { QuizRepositoryInterface } from "../../domain/interfaces/QuizRepositoryInterface";
import { QuizMapper } from "../../domain/mapper/QuizMapper";
import { authorizeQuizOperation } from "../services/QuizAuthorizationService";

export interface GetQuizzesByCourseInput {
  actor: AuthorizationActor | null | undefined;
  courseId?: number;
  courseIds?: number[];
  search?: string;
  tenantId?: string;
}

export class GetQuizzesByCourseUseCase {
  constructor(private readonly repository: QuizRepositoryInterface) {}

  async execute(
    input: GetQuizzesByCourseInput,
  ): Promise<Result<QuizListResponseDTO, Error>> {
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
          "Tenant ID wajib ditentukan untuk mengambil daftar ujian.",
        ),
      );
    }

    try {
      const targetCourseIds = input.courseId
        ? [input.courseId]
        : input.courseIds && input.courseIds.length > 0
          ? input.courseIds
          : [];

      const quizzes = await this.repository.getQuizzesByCourses({
        tenantId: effectiveTenantId,
        courseIds: targetCourseIds,
      });

      let filtered = quizzes;
      if (input.search?.trim()) {
        const q = input.search.toLowerCase().trim();
        filtered = filtered.filter(
          (quiz) =>
            quiz.name.toLowerCase().includes(q) ||
            quiz.intro.toLowerCase().includes(q),
        );
      }

      return Result.ok({
        quizzes: filtered.map((q) => QuizMapper.toSummaryDTO(q)),
        total: filtered.length,
      });
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
