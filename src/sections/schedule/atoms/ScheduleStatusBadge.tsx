"use client";

import type { FC } from "react";
import type { ScheduleSessionStatus } from "@/modules/schedule/domain/types/ScheduleTypes";
import Badge, { type BadgeColor } from "@/shared-ui/component/Badge";

interface ScheduleStatusBadgeProps {
  status: ScheduleSessionStatus;
  className?: string;
}

export const ScheduleStatusBadge: FC<ScheduleStatusBadgeProps> = ({
  status,
  className,
}) => {
  let label = "Terjadwal";
  let color: BadgeColor = "primary";

  switch (status) {
    case "DRAFT":
      label = "Draf";
      color = "secondary";
      break;
    case "PUBLISHED":
      label = "Terpublikasi";
      color = "success";
      break;
    case "SCHEDULED":
      label = "Terjadwal";
      color = "primary";
      break;
    case "IN_PROGRESS":
      label = "Sedang Berlangsung";
      color = "warning";
      break;
    case "COMPLETED":
      label = "Selesai";
      color = "success";
      break;
    case "CANCELLED":
      label = "Dibatalkan";
      color = "error";
      break;
    case "RESCHEDULED":
      label = "Dijadwal Ulang";
      color = "warning";
      break;
    case "ARCHIVED":
      label = "Diarsipkan";
      color = "secondary";
      break;
  }

  return (
    <Badge color={color} variant="soft" className={className}>
      {label}
    </Badge>
  );
};
