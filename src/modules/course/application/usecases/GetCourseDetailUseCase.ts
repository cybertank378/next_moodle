import { Result } from "@/core/base/Result";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { ValidationError } from "@/core/errors/ValidationError";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { authorizeCourseOperation } from "@/modules/course/application/services/CourseAuthorizationService";
import type { CourseDetailResponseDTO } from "@/modules/course/domain/dto/CourseResponseDto";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";
import { CourseMapper } from "@/modules/course/domain/mapper/CourseMapper";

import type { MoodleClient } from "@/core/moodle/types";

export interface GetCourseDetailInput {
  actor: AuthorizationActor | null | undefined;
  courseId: number;
  tenantId?: string;
  client?: MoodleClient;
}

export class GetCourseDetailUseCase {
  constructor(private readonly repository: CourseRepositoryInterface) {}

  async execute(
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

    try {
      // If STUDENT, check enrollment first
      if (actor.role === AppRole.STUDENT) {
        if (!input.client) {
          return Result.fail(
            new ValidationError(
              "Kredensial atau client Moodle siswa wajib disertakan.",
            ),
          );
        }

        const moodleUserId = actor.moodleUserId;
        if (!moodleUserId) {
          return Result.fail(
            new ValidationError("Moodle User ID tidak ditemukan untuk siswa."),
          );
        }

        const enrolledCourses = await this.repository.getUserCourses({
          tenantId: effectiveTenantId,
          moodleUserId,
          client: input.client,
        });

        const isEnrolled = enrolledCourses.some((c) => c.id === input.courseId);
        if (!isEnrolled) {
          return Result.fail(
            new NotFoundError(
              "Mata pelajaran tidak ditemukan atau Anda tidak terdaftar pada mata pelajaran ini.",
            ),
          );
        }

        const enrolledCourse = enrolledCourses.find(
          (c) => c.id === input.courseId,
        )!;

        // Fetch sections
        let sections: any[] = [];
        try {
          sections = await this.repository.getCourseContents({
            tenantId: effectiveTenantId,
            courseId: input.courseId,
            client: input.client,
          });
        } catch {
          // In case core_course_get_contents is restricted/degraded, return empty sections
          sections = [];
        }

        return Result.ok({
          course: CourseMapper.toSummaryDTO(enrolledCourse),
          sections,
        });
      }

      // For TENANT or ADMIN
      const course = await this.repository.getCourseById({
        tenantId: effectiveTenantId,
        courseId: input.courseId,
      });

      if (!course) {
        return Result.fail(
          new NotFoundError("Mata pelajaran tidak ditemukan."),
        );
      }

      let sections: any[] = [];
      try {
        sections = await this.repository.getCourseContents({
          tenantId: effectiveTenantId,
          courseId: input.courseId,
        });
      } catch {
        sections = [];
      }

      return Result.ok({
        course: CourseMapper.toSummaryDTO(course),
        sections,
      });
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
