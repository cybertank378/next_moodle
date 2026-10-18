import { BaseUseCase } from "@/core/base/BaseUseCase";
import { Result } from "@/core/base/Result";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { ValidationError } from "@/core/errors/ValidationError";
import type { MoodleClient } from "@/core/moodle/types";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { authorizeCourseOperation } from "@/modules/course/application/services/CourseAuthorizationService";
import type {
  CourseDetailResponseDTO,
  CourseSectionResponseDTO,
} from "@/modules/course/domain/dto/CourseResponseDto";
import type { CourseEntity } from "@/modules/course/domain/entity/CourseEntity";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";
import { CourseMapper } from "@/modules/course/domain/mapper/CourseMapper";

export interface GetCourseDetailInput {
  actor: AuthorizationActor | null | undefined;
  courseId: number;
  tenantId?: string;
  client?: MoodleClient;
}

export class GetCourseDetailUseCase extends BaseUseCase<
  GetCourseDetailInput,
  Result<CourseDetailResponseDTO, Error>
> {
  constructor(private readonly repository: CourseRepositoryInterface) {
    super();
  }

  async handle(
    input: GetCourseDetailInput,
  ): Promise<Result<CourseDetailResponseDTO, Error>> {
    const authError = authorizeCourseOperation(input.actor);
    if (authError) return Result.fail(authError);

    if (!input.courseId || input.courseId <= 0) {
      return Result.fail(
        new ValidationError("Course ID harus berupa angka positif yang valid."),
      );
    }

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
          "Tenant ID wajib ditentukan untuk mengambil detail course.",
        ),
      );
    }

    if (
      actor.role === AppRole.STUDENT &&
      (!input.client || !actor.moodleUserId)
    ) {
      return Result.fail(
        new ValidationError(
          "Kredensial atau client token Moodle siswa wajib disertakan.",
        ),
      );
    }

    try {
      let courseEntity: CourseEntity | null = null;

      // 1. For STUDENT or TEACHER with active user Moodle client, check enrolled courses first
      if (
        (actor.role === AppRole.STUDENT || actor.role === AppRole.TEACHER) &&
        input.client &&
        actor.moodleUserId
      ) {
        try {
          const enrolledCourses = await this.repository.getUserCourses({
            tenantId: effectiveTenantId,
            moodleUserId: actor.moodleUserId,
            client: input.client,
          });

          courseEntity =
            enrolledCourses.find((c) => c.id === input.courseId) || null;
        } catch {
          // If getUserCourses fails, fall through
        }
      }

      // 2. Student MUST be enrolled in the course
      if (actor.role === AppRole.STUDENT && !courseEntity) {
        return Result.fail(
          new NotFoundError(
            "Mata pelajaran tidak ditemukan atau Anda tidak terdaftar pada mata pelajaran ini.",
          ),
        );
      }

      // 3. For TEACHER (if not found in enrolled courses), TENANT, or ADMIN: fetch via getCourseById
      if (!courseEntity) {
        courseEntity = await this.repository.getCourseById({
          tenantId: effectiveTenantId,
          courseId: input.courseId,
          client: input.client,
        });
      }

      if (!courseEntity) {
        return Result.fail(
          new NotFoundError("Mata pelajaran tidak ditemukan."),
        );
      }

      // 4. Fetch sections / modules content
      let sections: CourseSectionResponseDTO[] = [];
      try {
        sections = await this.repository.getCourseContents({
          tenantId: effectiveTenantId,
          courseId: input.courseId,
          client: input.client,
        });
      } catch {
        sections = [];
      }

      return Result.ok({
        course: CourseMapper.toSummaryDTO(courseEntity),
        sections,
      });
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
