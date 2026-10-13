import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { ScheduleSessionType } from "@/modules/schedule/domain/types/ScheduleTypes";

export interface ScheduleQueryDTO {
  from: string; // ISO-8601 (YYYY-MM-DD or full timestamp)
  to: string; // ISO-8601 (YYYY-MM-DD or full timestamp)
  types?: ScheduleSessionType[];
  courseId?: number;
}

export interface GetStudentScheduleInput {
  actor: AuthorizationActor;
  query: ScheduleQueryDTO;
  moodleToken?: string;
}

export interface GetScheduleSessionDetailInput {
  actor: AuthorizationActor;
  sessionId: string;
  moodleToken?: string;
}
