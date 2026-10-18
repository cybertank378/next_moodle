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

export interface GetTenantSchedulesInput {
  actor: AuthorizationActor;
  query: ScheduleQueryDTO;
  moodleToken?: string;
}

export interface GetTeacherSchedulesInput {
  actor: AuthorizationActor;
  query: ScheduleQueryDTO;
  moodleToken?: string;
}

export interface GetScheduleSessionDetailInput {
  actor: AuthorizationActor;
  sessionId: string;
  moodleToken?: string;
}

export interface CreateScheduleInput {
  actor: AuthorizationActor;
  data: {
    title: string;
    sessionType: ScheduleSessionType;
    courseId: number;
    startsAt: string;
    endsAt: string;
    room?: string;
    instructor?: string;
    classGroup?: string;
    description?: string;
  };
  moodleToken?: string;
}

export interface UpdateScheduleInput {
  actor: AuthorizationActor;
  sessionId: string;
  data: Partial<{
    title: string;
    room: string;
    instructor: string;
    startsAt: string;
    endsAt: string;
    description: string;
  }>;
  moodleToken?: string;
}

export interface PublishScheduleInput {
  actor: AuthorizationActor;
  sessionId: string;
  moodleToken?: string;
}

export interface CancelScheduleInput {
  actor: AuthorizationActor;
  sessionId: string;
  reason?: string;
  moodleToken?: string;
}
