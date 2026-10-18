import type { AssignmentSubmissionStatus } from "@/modules/assignment/domain/types/AssignmentTypes";

export interface AssignmentQueryParams {
  courseId?: number;
  status?: AssignmentSubmissionStatus;
  search?: string;
}

export function parseAssignmentQuery(
  searchParams: URLSearchParams,
): AssignmentQueryParams {
  const courseIdParam = searchParams.get("courseId");
  const courseId = courseIdParam
    ? Number.parseInt(courseIdParam, 10)
    : undefined;
  const statusParam = searchParams.get("status");
  const status =
    statusParam &&
    statusParam !== "all" &&
    ["pending", "submitted", "graded", "overdue"].includes(statusParam)
      ? (statusParam as AssignmentSubmissionStatus)
      : undefined;
  const search = searchParams.get("search")?.trim() || undefined;

  return {
    courseId: Number.isNaN(courseId) ? undefined : courseId,
    status,
    search,
  };
}
