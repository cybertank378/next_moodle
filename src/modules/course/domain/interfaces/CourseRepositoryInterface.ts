import type { CourseSectionResponseDTO } from "@/modules/course/domain/dto/CourseResponseDto";
import type { CourseEntity } from "@/modules/course/domain/entity/CourseEntity";

export interface CourseRepositoryInterface {
  getUserCourses(input: {
    tenantId: string;
    moodleUserId: number;
  }): Promise<CourseEntity[]>;

  getTenantCourses(input: {
    tenantId: string;
    search?: string;
  }): Promise<CourseEntity[]>;

  getCourseContents(input: {
    tenantId: string;
    courseId: number;
  }): Promise<CourseSectionResponseDTO[]>;
}
