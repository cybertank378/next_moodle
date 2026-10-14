"use client";

import type { AssignmentSubmissionStatus } from "@/modules/assignment/domain/types/AssignmentTypes";
import Badge from "@/shared-ui/component/Badge";

interface AssignmentStatusBadgeProps {
  status: AssignmentSubmissionStatus;
  isOverdue?: boolean;
}

export function AssignmentStatusBadge({
  status,
  isOverdue,
}: AssignmentStatusBadgeProps) {
  if (isOverdue && status !== "SUBMITTED" && status !== "GRADED") {
    return (
      <Badge color="error" variant="soft">
        Terlambat
      </Badge>
    );
  }

  switch (status) {
    case "NEW":
      return (
        <Badge color="secondary" variant="soft">
          Belum Dikerjakan
        </Badge>
      );
    case "DRAFT":
      return (
        <Badge color="warning" variant="soft">
          Draf
        </Badge>
      );
    case "SUBMITTED":
      return (
        <Badge color="primary" variant="soft">
          Terkirim
        </Badge>
      );
    case "GRADED":
      return (
        <Badge color="success" variant="soft">
          Dinilai
        </Badge>
      );
    case "REOPENED":
      return (
        <Badge color="info" variant="soft">
          Dibuka Kembali
        </Badge>
      );
    default:
      return (
        <Badge color="secondary" variant="soft">
          {status}
        </Badge>
      );
  }
}
