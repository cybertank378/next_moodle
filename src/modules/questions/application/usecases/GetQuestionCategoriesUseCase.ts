import { Result } from "@/core/base/Result";
import { ValidationError } from "@/core/errors/ValidationError";
import type { MoodleClient } from "@/core/moodle/types";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import { authorizeQuestionOperation } from "@/modules/questions/application/services/QuestionAuthorizationService";
import type { QuestionRepositoryInterface } from "@/modules/questions/domain/interfaces/QuestionRepositoryInterface";
import type { QuestionCategory } from "@/modules/questions/domain/types/QuestionTypes";

export interface GetQuestionCategoriesInput {
  actor: AuthorizationActor | null | undefined;
  contextId?: number;
  tenantId?: string;
  client?: MoodleClient;
}

export class GetQuestionCategoriesUseCase {
  constructor(private readonly repository: QuestionRepositoryInterface) {}

  async execute(
    input: GetQuestionCategoriesInput,
  ): Promise<Result<QuestionCategory[], Error>> {
    const authError = authorizeQuestionOperation(
      input.actor,
      Permission.QUESTION_READ,
    );
    if (authError) return Result.fail(authError);

    const effectiveTenantId = input.actor?.tenantId || input.tenantId;
    if (!effectiveTenantId) {
      return Result.fail(
        new ValidationError(
          "Tenant ID wajib ditentukan untuk mengambil kategori bank soal.",
        ),
      );
    }

    try {
      const categories = await this.repository.getQuestionCategories({
        tenantId: effectiveTenantId,
        contextId: input.contextId ?? 1,
        client: input.client,
      });

      return Result.ok(categories);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
