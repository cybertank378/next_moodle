import type {
  ScheduleSessionStatus,
  ScheduleSessionType,
} from "@/modules/schedule/domain/types/ScheduleTypes";

export interface ScheduleSessionItemDTO {
  id: string;
  sessionType: ScheduleSessionType;
  title: string;
  startsAt: string; // ISO-8601
  endsAt: string; // ISO-8601
  allDay: boolean;
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
}

export interface ScheduleResponseDTO {
  items: ScheduleSessionItemDTO[];
  range: {
    from: string;
    to: string;
  };
  meta: {
    total: number;
    supportedTypes: ScheduleSessionType[];
    blockedTypes?: string[];
  };
}
