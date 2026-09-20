import type { CourseVisibility } from "@/modules/courses/domain/types/CourseVisibility";

export interface CourseResponseDTO {
  readonly id: string;
  readonly moodleCourseId: number;
  readonly fullName: string;
  readonly shortName: string;
  readonly summary: string;
  readonly categoryId: number | null;
  readonly visibility: CourseVisibility;
  readonly enrolledUserCount: number;
  readonly startDate: string | null;
  readonly endDate: string | null;
}

export interface CourseDetailResponseDTO extends CourseResponseDTO {
  readonly totalQuizzes?: number;
}
