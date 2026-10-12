"use client";

import type { FC } from "react";
import type { CalendarEventType } from "@/modules/calendar/domain/types/CalendarEventTypes";
import Badge from "@/shared-ui/component/Badge";

interface CalendarEventBadgeProps {
  type: CalendarEventType;
  className?: string;
}

export const CalendarEventBadge: FC<CalendarEventBadgeProps> = ({
  type,
  className,
}) => {
  switch (type) {
    case "QUIZ_EXAM":
      return (
        <Badge color="primary" variant="soft" className={className}>
          Ujian / Kuis
        </Badge>
      );
    case "COURSE_CLASS":
      return (
        <Badge color="info" variant="soft" className={className}>
          Jadwal Pelajaran
        </Badge>
      );
    case "ASSIGNMENT_DUE":
      return (
        <Badge color="warning" variant="soft" className={className}>
          Tugas
        </Badge>
      );
    case "ANNOUNCEMENT":
      return (
        <Badge color="secondary" variant="soft" className={className}>
          Pengumuman
        </Badge>
      );
    default:
      return (
        <Badge color="success" variant="soft" className={className}>
          Kegiatan
        </Badge>
      );
  }
};
