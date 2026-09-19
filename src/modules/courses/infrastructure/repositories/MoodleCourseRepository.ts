import "server-only";
import type { MoodleRestClient } from "@/core/moodle/MoodleRestClient";
import type { Course } from "../../domain/entities/Course";
import type { CourseRepository } from "../../domain/interfaces/CourseRepository";
import { MoodleCourseMapper, type MoodleCourseRaw } from "../mappers/MoodleCourseMapper";

export class MoodleCourseRepository implements CourseRepository {
  constructor(private readonly moodleClient: MoodleRestClient) {}

  public async getUserCourses(moodleUserId: number, tenantId: string): Promise<readonly Course[]> {
    const rawCourses = await this.moodleClient.call<readonly MoodleCourseRaw[]>(
      "core_enrol_get_users_courses",
      {
        userid: moodleUserId,
      },
    );

    return MoodleCourseMapper.toDomainList(rawCourses, tenantId);
  }

  public async getCourseById(courseId: string, tenantId: string): Promise<Course | null> {
    const numericIdMatch = courseId.match(/\d+$/);
    const moodleId = numericIdMatch
      ? Number.parseInt(numericIdMatch[0], 10)
      : Number.parseInt(courseId, 10);

    if (Number.isNaN(moodleId)) {
      return null;
    }

    const rawCourses = await this.moodleClient.call<{ courses: readonly MoodleCourseRaw[] }>(
      "core_course_get_courses_by_field",
      {
        field: "id",
        value: String(moodleId),
      },
    );

    const first = rawCourses.courses?.[0];
    if (!first) {
      return null;
    }

    return MoodleCourseMapper.toDomain(first, tenantId);
  }
}
