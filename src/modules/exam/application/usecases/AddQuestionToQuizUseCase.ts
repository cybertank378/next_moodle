import { Result } from "@/core/base/Result";
import { ValidationError } from "@/core/errors/ValidationError";
import type { MoodleClient } from "@/core/moodle/types";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import { authorizeExamOperation } from "@/modules/exam/application/services/ExamAuthorizationService";
import type { ExamAdministrationRepositoryInterface } from "@/modules/exam/domain/interfaces/ExamAdministrationRepositoryInterface";

export interface AddQuestionToQuizInput {
  actor: AuthorizationActor | null | undefined;
  quizId: number;
  questionId: number;
  maxMark?: number;
  page?: number;
  tenantId?: string;
  client?: MoodleClient;
}

export interface AddQuestionToQuizResult {
  id: number;
  slot: number;
  page: number;
}

export class AddQuestionToQuizUseCase {
  constructor(
    private readonly repository: ExamAdministrationRepositoryInterface,
  ) {}

  async execute(
    input: AddQuestionToQuizInput,
  ): Promise<Result<AddQuestionToQuizResult, Error>> {
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

    if (!input.questionId || input.questionId <= 0) {
      return Result.fail(
        new ValidationError(
          "Question ID harus berupa angka positif yang valid.",
        ),
      );
    }

    if (input.maxMark !== undefined && input.maxMark <= 0) {
      return Result.fail(
        new ValidationError(
          "Nilai maksimum soal (maxMark) harus lebih besar dari 0.",
        ),
      );
    }

    if (input.page !== undefined && input.page <= 0) {
      return Result.fail(
        new ValidationError("Nomor halaman (page) harus lebih besar dari 0."),
      );
    }

    const effectiveTenantId = input.actor?.tenantId || input.tenantId;
    if (!effectiveTenantId) {
      return Result.fail(
        new ValidationError(
          "Tenant ID wajib ditentukan untuk menambahkan soal ke kuis.",
        ),
      );
    }

    try {
      const result = await this.repository.addQuestionToQuiz({
        tenantId: effectiveTenantId,
        quizId: input.quizId,
        questionId: input.questionId,
        maxMark: input.maxMark ?? 1.0,
        page: input.page ?? 1,
        client: input.client,
      });

      return Result.ok(result);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
