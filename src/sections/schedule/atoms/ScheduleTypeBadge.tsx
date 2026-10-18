"use client";

import type { FC } from "react";
import type { ScheduleSessionType } from "@/modules/schedule/domain/types/ScheduleTypes";
import Badge, { type BadgeColor } from "@/shared-ui/component/Badge";

interface ScheduleTypeBadgeProps {
  type: ScheduleSessionType;
  className?: string;
}

export const ScheduleTypeBadge: FC<ScheduleTypeBadgeProps> = ({
  type,
  className,
}) => {
  let label = "Lainnya";
  let color: BadgeColor = "secondary";

  switch (type) {
    case "EXAM":
      label = "Ujian / Kuis";
      color = "error";
      break;
    case "LESSON":
      label = "Pelajaran";
      color = "primary";
      break;
    case "CONSULTATION":
      label = "Konsultasi";
      color = "info";
      break;
    default:
      label = "Lainnya";
      color = "secondary";
      break;
  }

  return (
    <Badge color={color} variant="soft" className={className}>
      {label}
    </Badge>
  );
};
