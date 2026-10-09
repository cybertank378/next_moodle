import type { MoodleClient } from "@/core/moodle/types";
import type { CourseSectionResponseDTO } from "@/modules/course/domain/dto/CourseResponseDto";
import type { CourseEntity } from "@/modules/course/domain/entity/CourseEntity";

export interface CourseRepositoryInterface {
  getUserCourses(input: {
    tenantId: string;
    moodleUserId: number;
    client?: MoodleClient;
  }): Promise<CourseEntity[]>;

  getTenantCourses(input: {
    tenantId: string;
    search?: string;
    client?: MoodleClient;
  }): Promise<CourseEntity[]>;

  getCourseContents(input: {
    tenantId: string;
    courseId: number;
    client?: MoodleClient;
  }): Promise<CourseSectionResponseDTO[]>;
}
