import { BaseUseCase } from "@/core/base/BaseUseCase";
import { Result } from "@/core/base/Result";
import { ValidationError } from "@/core/errors/ValidationError";
import type { MoodleClient } from "@/core/moodle/types";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import { authorizeQuestionOperation } from "@/modules/questions/application/services/QuestionAuthorizationService";
import type { QuestionRepositoryInterface } from "@/modules/questions/domain/interfaces/QuestionRepositoryInterface";
import type {
  GetQuestionsQueryDto,
  GetQuestionsResultDto,
} from "@/modules/questions/domain/types/QuestionTypes";

export interface GetQuestionsInput {
  actor: AuthorizationActor | null | undefined;
  categoryId?: number;
  qtype?: string;
  search?: string;
  page?: number;
  limit?: number;
  tenantId?: string;
  client?: MoodleClient;
}

export class GetQuestionsUseCase extends BaseUseCase<
  GetQuestionsInput,
  Result<GetQuestionsResultDto, Error>
> {
  constructor(private readonly repository: QuestionRepositoryInterface) {
    super();
  }

  async handle(
    input: GetQuestionsInput,
  ): Promise<Result<GetQuestionsResultDto, Error>> {
    const authError = authorizeQuestionOperation(
      input.actor,
      Permission.QUESTION_READ,
    );
    if (authError) return Result.fail(authError);

    if (input.page !== undefined && input.page < 1) {
      return Result.fail(
        new ValidationError("Nomor halaman (page) harus >= 1."),
      );
    }

    if (input.limit !== undefined && input.limit < 1) {
      return Result.fail(new ValidationError("Limit harus >= 1."));
    }

    const effectiveTenantId = input.actor?.tenantId || input.tenantId;
    if (!effectiveTenantId) {
      return Result.fail(
        new ValidationError(
          "Tenant ID wajib ditentukan untuk mengambil daftar soal.",
        ),
      );
    }

    try {
      const query: GetQuestionsQueryDto = {
        categoryId: input.categoryId,
        qtype: input.qtype,
        search: input.search,
        page: input.page,
        limit: input.limit,
      };

      const result = await this.repository.getQuestions({
        tenantId: effectiveTenantId,
        params: query,
        client: input.client,
      });

      return Result.ok(result);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
