import type { CalendarEventType } from "@/modules/calendar/domain/types/CalendarEventTypes";

export interface CalendarEventItemDTO {
  id: string;
  sourceType: CalendarEventType;
  title: string;
  startAt: string; // ISO-8601
  endAt?: string | null; // ISO-8601
  allDay: boolean;
  courseId?: number;
  courseName?: string;
  relatedResourceId?: string | number;
  description?: string;
  status?: string;
  detailRoute?: string;
  timezone?: string;
}

export interface CalendarEventsResponseDTO {
  items: CalendarEventItemDTO[];
  range: {
    from: string;
    to: string;
  };
  meta: {
    total: number;
    supportedTypes: CalendarEventType[];
    blockedTypes?: string[];
  };
}
