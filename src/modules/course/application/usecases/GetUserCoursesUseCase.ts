import { BaseUseCase } from "@/core/base/BaseUseCase";
import { Result } from "@/core/base/Result";
import { ValidationError } from "@/core/errors/ValidationError";
import type { MoodleClient } from "@/core/moodle/types";
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
  client?: MoodleClient;
}

export class GetUserCoursesUseCase extends BaseUseCase<
  GetUserCoursesInput,
  Result<CourseListResponseDTO, Error>
> {
  constructor(private readonly repository: CourseRepositoryInterface) {
    super();
  }

  async handle(
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
      if (actor.role === AppRole.STUDENT || actor.role === AppRole.TEACHER) {
        if (!input.client) {
          return Result.fail(
            new ValidationError(
              "Kredensial atau client Moodle wajib disertakan.",
            ),
          );
        }

        const moodleUserId = input.moodleUserId ?? actor.moodleUserId;
        if (moodleUserId) {
          try {
            let courses = await this.repository.getUserCourses({
              tenantId: effectiveTenantId,
              moodleUserId,
              client: input.client,
            });

            if (input.search?.trim()) {
              const q = input.search.toLowerCase().trim();
              courses = courses.filter(
                (c) =>
                  c.fullName.toLowerCase().includes(q) ||
                  c.shortName.toLowerCase().includes(q),
              );
            }

            return Result.ok({
              courses: courses.map(CourseMapper.toSummaryDTO),
              total: courses.length,
            });
          } catch (err) {
            // For teacher, if getUserCourses fails or is not supported, attempt getTenantCourses fallback
            if (actor.role === AppRole.STUDENT) {
              throw err;
            }
          }
        } else if (actor.role === AppRole.STUDENT) {
          return Result.fail(
            new ValidationError(
              "Moodle User ID tidak ditemukan untuk sesi siswa.",
            ),
          );
        }
      }

      // TENANT, ADMIN, or TEACHER fallback
      const courses = await this.repository.getTenantCourses({
        tenantId: effectiveTenantId,
        search: input.search,
        client: input.client,
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
