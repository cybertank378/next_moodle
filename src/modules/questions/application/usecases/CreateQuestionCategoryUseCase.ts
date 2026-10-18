import { BaseUseCase } from "@/core/base/BaseUseCase";
import { Result } from "@/core/base/Result";
import { ValidationError } from "@/core/errors/ValidationError";
import type { MoodleClient } from "@/core/moodle/types";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import { authorizeQuestionOperation } from "@/modules/questions/application/services/QuestionAuthorizationService";
import type { QuestionRepositoryInterface } from "@/modules/questions/domain/interfaces/QuestionRepositoryInterface";
import type {
  CreateQuestionCategoryRequestDto,
  QuestionCategory,
} from "@/modules/questions/domain/types/QuestionTypes";

export interface CreateQuestionCategoryInput {
  actor: AuthorizationActor | null | undefined;
  name: string;
  contextId: number;
  parentId?: number;
  info?: string;
  tenantId?: string;
  client?: MoodleClient;
}

export class CreateQuestionCategoryUseCase extends BaseUseCase<
  CreateQuestionCategoryInput,
  Result<QuestionCategory, Error>
> {
  constructor(private readonly repository: QuestionRepositoryInterface) {
    super();
  }

  async handle(
    input: CreateQuestionCategoryInput,
  ): Promise<Result<QuestionCategory, Error>> {
    const authError = authorizeQuestionOperation(
      input.actor,
      Permission.QUESTION_CREATE,
    );
    if (authError) return Result.fail(authError);

    if (!input.name || !input.name.trim()) {
      return Result.fail(
        new ValidationError("Nama kategori bank soal tidak boleh kosong."),
      );
    }

    if (!input.contextId || input.contextId <= 0) {
      return Result.fail(
        new ValidationError(
          "Context ID harus berupa angka positif yang valid.",
        ),
      );
    }

    const effectiveTenantId = input.actor?.tenantId || input.tenantId;
    if (!effectiveTenantId) {
      return Result.fail(
        new ValidationError(
          "Tenant ID wajib ditentukan untuk membuat kategori bank soal.",
        ),
      );
    }

    try {
      const dto: CreateQuestionCategoryRequestDto = {
        name: input.name.trim(),
        contextId: input.contextId,
        parent: input.parentId,
        info: input.info,
      };

      const category = await this.repository.createQuestionCategory({
        tenantId: effectiveTenantId,
        dto,
        client: input.client,
      });

      return Result.ok(category);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
