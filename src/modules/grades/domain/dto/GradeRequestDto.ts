import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";

export interface GetUserGradesRequestDto {
  actor: AuthorizationActor;
  courseId: number;
  userId?: number;
  studentMoodleToken?: string;
}

export interface GetCourseGradesRequestDto {
  actor: AuthorizationActor;
  courseId: number;
  activityId?: number;
}
