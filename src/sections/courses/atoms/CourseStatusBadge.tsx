import type { CourseVisibility } from "@/modules/courses/domain/types/CourseVisibility";
import { StatusBadge } from "@/shared-ui/component/StatusBadge";

export interface CourseStatusBadgeProps {
  readonly visibility: CourseVisibility;
}

export function CourseStatusBadge({ visibility }: CourseStatusBadgeProps) {
  if (visibility === "visible") {
    return <StatusBadge label="Aktif" variant="success" />;
  }
  return <StatusBadge label="Disembunyikan" variant="secondary" />;
}
