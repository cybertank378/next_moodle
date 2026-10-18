import { Result } from "@/core/base/Result";
import { ValidationError } from "@/core/errors/ValidationError";
import type { MoodleClient } from "@/core/moodle/types";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import { authorizeExamOperation } from "@/modules/exam/application/services/ExamAuthorizationService";
import type { ExamAdministrationRepositoryInterface } from "@/modules/exam/domain/interfaces/ExamAdministrationRepositoryInterface";

export interface AddRandomQuestionsToQuizInput {
  actor: AuthorizationActor | null | undefined;
  quizId: number;
  categoryId: number;
  randomCount?: number;
  includeSubcategories?: boolean;
  tenantId?: string;
  client?: MoodleClient;
}

export class AddRandomQuestionsToQuizUseCase {
  constructor(
    private readonly repository: ExamAdministrationRepositoryInterface,
  ) {}

  async execute(
    input: AddRandomQuestionsToQuizInput,
  ): Promise<Result<{ message: string }, Error>> {
    const authError = authorizeExamOperation(
      input.actor,
      Permission.EXAM_UPDATE,
    );
    if (authError) return Result.fail(authError);

    if (!input.quizId || input.quizId <= 0) {
      return Result.fail(
        new ValidationError("Quiz ID harus berupa angka positif yang valid."),
      );
    }

    if (!input.categoryId || input.categoryId <= 0) {
      return Result.fail(
        new ValidationError(
          "Category ID harus berupa angka positif yang valid.",
        ),
      );
    }

    const count = input.randomCount ?? 1;
    if (count <= 0) {
      return Result.fail(
        new ValidationError(
          "Jumlah soal acak (randomCount) harus lebih besar dari 0.",
        ),
      );
    }

    const effectiveTenantId = input.actor?.tenantId || input.tenantId;
    if (!effectiveTenantId) {
      return Result.fail(
        new ValidationError(
          "Tenant ID wajib ditentukan untuk menambahkan soal acak ke kuis.",
        ),
      );
    }

    try {
      await this.repository.addRandomQuestions({
        tenantId: effectiveTenantId,
        quizId: input.quizId,
        categoryId: input.categoryId,
        randomCount: count,
        includeSubcategories: input.includeSubcategories ?? false,
        client: input.client,
      });

      return Result.ok({ message: "Soal acak berhasil ditambahkan ke kuis." });
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
