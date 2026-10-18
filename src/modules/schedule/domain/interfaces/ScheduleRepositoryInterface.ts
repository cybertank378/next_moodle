import type { MoodleClient } from "@/core/moodle/types";
import type { ScheduleSessionEntity } from "@/modules/schedule/domain/entity/ScheduleSessionEntity";
import type { ScheduleSessionType } from "@/modules/schedule/domain/types/ScheduleTypes";

export interface ScheduleQueryOptions {
  tenantId: string;
  moodleUserId: number;
  from: Date;
  to: Date;
  types?: ScheduleSessionType[];
  courseId?: number;
  client: MoodleClient;
}

export interface ScheduleRepositoryInterface {
  getStudentSchedule(
    options: ScheduleQueryOptions,
  ): Promise<ScheduleSessionEntity[]>;

  getTenantSchedule(
    options: ScheduleQueryOptions,
  ): Promise<ScheduleSessionEntity[]>;

  getTeacherSchedule(
    options: ScheduleQueryOptions,
  ): Promise<ScheduleSessionEntity[]>;

  getSessionById(options: {
    tenantId: string;
    moodleUserId: number;
    sessionId: string;
    client: MoodleClient;
  }): Promise<ScheduleSessionEntity | null>;

  createSession(options: {
    tenantId: string;
    createdById?: string;
    data: {
      title: string;
      sessionType: ScheduleSessionType;
      courseId: number;
      courseName?: string;
      subjectCode?: string;
      startsAt: string;
      endsAt: string;
      room?: string;
      instructor?: string;
      classGroup?: string;
      description?: string;
    };
  }): Promise<ScheduleSessionEntity>;

  updateSession(options: {
    tenantId: string;
    sessionId: string;
    data: Partial<{
      title: string;
      room: string;
      instructor: string;
      startsAt: string;
      endsAt: string;
      description: string;
      status: import("@/modules/schedule/domain/types/ScheduleTypes").ScheduleSessionStatus;
    }>;
  }): Promise<ScheduleSessionEntity | null>;

  publishSession(options: {
    tenantId: string;
    sessionId: string;
  }): Promise<ScheduleSessionEntity | null>;

  cancelSession(options: {
    tenantId: string;
    sessionId: string;
  }): Promise<ScheduleSessionEntity | null>;
}
