export type ScheduleSessionType = "LESSON" | "EXAM" | "CONSULTATION" | "OTHER";

export type ScheduleSessionStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "RESCHEDULED"
  | "ARCHIVED";

export interface ScheduleSessionProps {
  id: string;
  sessionType: ScheduleSessionType;
  title: string;
  startsAt: string; // ISO 8601
  endsAt: string; // ISO 8601
  allDay?: boolean;
  courseId?: number;
  courseName?: string;
  subjectCode?: string;
  room?: string;
  instructor?: string;
  classGroup?: string;
  status: ScheduleSessionStatus;
  detailRoute?: string;
  timezone?: string;
  description?: string;
  sourceUpdatedAt?: string;
  isPublished?: boolean;
}
