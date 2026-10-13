import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { CalendarEventType } from "@/modules/calendar/domain/types/CalendarEventTypes";

export interface CalendarEventsQueryDTO {
  from: string; // ISO-8601 string or YYYY-MM-DD
  to: string; // ISO-8601 string or YYYY-MM-DD
  types?: CalendarEventType[];
}

export interface GetStudentCalendarEventsInput {
  actor: AuthorizationActor | null | undefined;
  query: CalendarEventsQueryDTO;
  moodleToken?: string;
}
