"use client";

import type { QuizAccessStatus } from "@/modules/quiz/domain/types/QuizTypes";
import Badge from "@/shared-ui/component/Badge";

interface Props {
  status: QuizAccessStatus;
}

export default function QuizStatusBadge({ status }: Props) {
  if (status === "OPEN") {
    return (
      <Badge variant="soft" color="success">
        Aktif / Terbuka
      </Badge>
    );
  }

  if (status === "UPCOMING") {
    return (
      <Badge variant="soft" color="warning">
        Akan Datang
      </Badge>
    );
  }

  return (
    <Badge variant="soft" color="error">
      Ditutup
    </Badge>
  );
}
