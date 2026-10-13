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

  getSessionById(options: {
    tenantId: string;
    moodleUserId: number;
    sessionId: string;
    client: MoodleClient;
  }): Promise<ScheduleSessionEntity | null>;
}
