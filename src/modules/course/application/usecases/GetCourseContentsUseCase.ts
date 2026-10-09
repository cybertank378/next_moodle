import { Result } from "@/core/base/Result";
import { ValidationError } from "@/core/errors/ValidationError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { authorizeCourseOperation } from "@/modules/course/application/services/CourseAuthorizationService";
import type { CourseSectionResponseDTO } from "@/modules/course/domain/dto/CourseResponseDto";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";

export interface GetCourseContentsInput {
  actor: AuthorizationActor | null | undefined;
  courseId: number;
  tenantId?: string;
}

export class GetCourseContentsUseCase {
  constructor(private readonly repository: CourseRepositoryInterface) {}

  async execute(
    input: GetCourseContentsInput,
  ): Promise<Result<CourseSectionResponseDTO[], Error>> {
    const authError = authorizeCourseOperation(input.actor);
    if (authError) return Result.fail(authError);

    if (!input.courseId || input.courseId <= 0) {
      return Result.fail(
        new ValidationError("Course ID harus berupa angka positif yang valid."),
      );
    }

    const effectiveTenantId = input.actor?.tenantId || input.tenantId;
    if (!effectiveTenantId) {
      return Result.fail(
        new ValidationError(
          "Tenant ID wajib ditentukan untuk mengambil konten course.",
        ),
      );
    }

    try {
      const sections = await this.repository.getCourseContents({
        tenantId: effectiveTenantId,
        courseId: input.courseId,
      });

      return Result.ok(sections);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
