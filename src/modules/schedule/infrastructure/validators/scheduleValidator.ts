import { ValidationError } from "@/core/errors/ValidationError";
import type { ScheduleQueryDTO } from "@/modules/schedule/domain/dto/ScheduleRequestDTO";
import type { ScheduleSessionType } from "@/modules/schedule/domain/types/ScheduleTypes";

const VALID_TYPES: ScheduleSessionType[] = [
  "LESSON",
  "EXAM",
  "CONSULTATION",
  "OTHER",
];

const MAX_WINDOW_DAYS = 95; // roughly 3 months

export function parseScheduleQuery(
  searchParams: URLSearchParams,
): ScheduleQueryDTO {
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  if (!fromParam) {
    throw new ValidationError("Parameter 'from' wajib ditentukan.");
  }
  if (!toParam) {
    throw new ValidationError("Parameter 'to' wajib ditentukan.");
  }

  const fromDate = new Date(fromParam);
  const toDate = new Date(toParam);

  if (Number.isNaN(fromDate.getTime())) {
    throw new ValidationError("Format tanggal 'from' tidak valid.");
  }
  if (Number.isNaN(toDate.getTime())) {
    throw new ValidationError("Format tanggal 'to' tidak valid.");
  }

  if (fromDate > toDate) {
    throw new ValidationError(
      "Parameter 'from' tidak boleh lebih besar dari 'to'.",
    );
  }

  const diffMs = toDate.getTime() - fromDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays > MAX_WINDOW_DAYS) {
    throw new ValidationError(
      `Rentang jadwal melebihi batas maksimum ${MAX_WINDOW_DAYS} hari.`,
    );
  }

  const typesParam = searchParams.get("types");
  let types: ScheduleSessionType[] | undefined;
  if (typesParam) {
    const rawTypes = typesParam
      .split(",")
      .map((t) => t.trim().toUpperCase() as ScheduleSessionType);
    types = rawTypes.filter((t) => VALID_TYPES.includes(t));
  }

  const courseIdParam = searchParams.get("courseId");
  let courseId: number | undefined;
  if (courseIdParam) {
    const parsedCourseId = parseInt(courseIdParam, 10);
    if (!Number.isNaN(parsedCourseId)) {
      courseId = parsedCourseId;
    }
  }

  return {
    from: fromParam,
    to: toParam,
    types,
    courseId,
  };
}
