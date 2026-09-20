import type { Course } from "@/modules/courses/domain/entities/Course";

export interface CourseRepository {
  getUserCourses(
    moodleUserId: number,
    tenantId: string,
  ): Promise<readonly Course[]>;
  getCourseById(courseId: string, tenantId: string): Promise<Course | null>;
}
