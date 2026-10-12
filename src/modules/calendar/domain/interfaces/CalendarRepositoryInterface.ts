import type { MoodleClient } from "@/core/moodle/types";
import type { CalendarEventEntity } from "@/modules/calendar/domain/entity/CalendarEventEntity";
import type { CalendarEventType } from "@/modules/calendar/domain/types/CalendarEventTypes";

export interface CalendarEventQueryOptions {
  tenantId: string;
  moodleUserId: number;
  from: Date;
  to: Date;
  types?: CalendarEventType[];
  client: MoodleClient;
}

export interface CalendarRepositoryInterface {
  getStudentCalendarEvents(
    options: CalendarEventQueryOptions,
  ): Promise<CalendarEventEntity[]>;
}
