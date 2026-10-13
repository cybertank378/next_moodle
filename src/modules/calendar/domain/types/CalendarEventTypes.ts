export type CalendarEventType =
  | "QUIZ_EXAM"
  | "COURSE_CLASS"
  | "ASSIGNMENT_DUE"
  | "ANNOUNCEMENT"
  | "ACADEMIC_EVENT";

export interface CalendarEventProps {
  id: string;
  sourceType: CalendarEventType;
  title: string;
  startAt: string; // ISO 8601
  endAt?: string | null; // ISO 8601
  allDay: boolean;
  courseId?: number;
  courseName?: string;
  relatedResourceId?: string | number;
  description?: string;
  status?: string;
  detailRoute?: string;
  timezone?: string;
}
