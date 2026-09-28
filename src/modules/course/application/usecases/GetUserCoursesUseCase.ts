import { Result } from "@/core/base/Result";
import { ValidationError } from "@/core/errors/ValidationError";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { authorizeCourseOperation } from "@/modules/course/application/services/CourseAuthorizationService";
import type { CourseListResponseDTO } from "@/modules/course/domain/dto/CourseResponseDto";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";
import { CourseMapper } from "@/modules/course/domain/mapper/CourseMapper";

export interface GetUserCoursesInput {
  actor: AuthorizationActor | null | undefined;
  tenantId?: string;
  moodleUserId?: number;
  search?: string;
}

export class GetUserCoursesUseCase {
  constructor(private readonly repository: CourseRepositoryInterface) {}

  async execute(
    input: GetUserCoursesInput,
  ): Promise<Result<CourseListResponseDTO, Error>> {
    const authError = authorizeCourseOperation(input.actor);
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
          "Tenant ID wajib ditentukan untuk mengambil course.",
        ),
      );
    }

    try {
      if (actor.role === AppRole.STUDENT) {
        const moodleUserId = input.moodleUserId ?? actor.moodleUserId;
        if (!moodleUserId) {
          return Result.fail(
            new ValidationError(
              "Moodle User ID tidak ditemukan untuk sesi siswa.",
            ),
          );
        }

        const courses = await this.repository.getUserCourses({
          tenantId: effectiveTenantId,
          moodleUserId,
        });

        return Result.ok({
          courses: courses.map(CourseMapper.toSummaryDTO),
          total: courses.length,
        });
      }

      // TENANT or ADMIN
      const courses = await this.repository.getTenantCourses({
        tenantId: effectiveTenantId,
        search: input.search,
      });

      return Result.ok({
        courses: courses.map(CourseMapper.toSummaryDTO),
        total: courses.length,
      });
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
