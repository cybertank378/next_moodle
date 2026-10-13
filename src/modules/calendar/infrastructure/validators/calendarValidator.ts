import { ValidationError } from "@/core/errors/ValidationError";
import type { CalendarEventsQueryDTO } from "@/modules/calendar/domain/dto/CalendarRequestDTO";
import type { CalendarEventType } from "@/modules/calendar/domain/types/CalendarEventTypes";

const VALID_TYPES: CalendarEventType[] = [
  "QUIZ_EXAM",
  "COURSE_CLASS",
  "ASSIGNMENT_DUE",
  "ANNOUNCEMENT",
  "ACADEMIC_EVENT",
];

const MAX_WINDOW_DAYS = 95; // roughly 3 months

export function parseCalendarEventsQuery(
  searchParams: URLSearchParams,
): CalendarEventsQueryDTO {
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
      `Rentang kalender melebihi batas maksimum ${MAX_WINDOW_DAYS} hari.`,
    );
  }

  const typesParam = searchParams.get("types");
  let types: CalendarEventType[] | undefined;
  if (typesParam) {
    const rawTypes = typesParam
      .split(",")
      .map((t) => t.trim().toUpperCase() as CalendarEventType);
    types = rawTypes.filter((t) => VALID_TYPES.includes(t));
  }

  return {
    from: fromParam,
    to: toParam,
    types,
  };
}
