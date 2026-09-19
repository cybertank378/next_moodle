import type { CurrentActor } from "@/core/auth/CurrentActor";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import type { CourseResponseDTO } from "../../domain/dto/CourseResponseDTO";
import type { Course } from "../../domain/entities/Course";
import type { CourseRepository } from "../../domain/interfaces/CourseRepository";

export class GetMyCoursesUseCase {
  constructor(private readonly courseRepository: CourseRepository) {}

  public async execute(
    actor: CurrentActor | null,
  ): Promise<readonly CourseResponseDTO[]> {
    if (!actor) {
      throw new UnauthorizedError(
        "Pengguna harus masuk untuk melihat daftar kursus.",
      );
    }

    const courses = await this.courseRepository.getUserCourses(
      actor.moodleUserId,
      actor.tenantId,
    );

    return courses.map(
      (course: Course): CourseResponseDTO => ({
        id: course.id,
        moodleCourseId: course.moodleCourseId,
        fullName: course.fullName,
        shortName: course.shortName,
        summary: course.summary ?? "",
        categoryId: course.categoryId ?? null,
        visibility: course.visibility,
        enrolledUserCount: course.enrolledUserCount ?? 0,
        startDate: course.startDate ? course.startDate.toISOString() : null,
        endDate: course.endDate ? course.endDate.toISOString() : null,
      }),
    );
  }
}
