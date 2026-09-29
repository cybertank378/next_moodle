import { ValidationError } from "@/core/errors/ValidationError";

export function parseCourseId(param: unknown): number {
  if (param === undefined || param === null || param === "") {
    throw new ValidationError("Parameter courseId wajib diisi.");
  }
  const id =
    typeof param === "number" ? param : Number.parseInt(String(param), 10);
  if (Number.isNaN(id) || id <= 0) {
    throw new ValidationError("Parameter courseId harus berupa angka positif.");
  }
  return id;
}

export function parseOptionalPositiveInt(
  param: unknown,
  fieldName: string,
): number | undefined {
  if (param === undefined || param === null || param === "") {
    return undefined;
  }
  const id =
    typeof param === "number" ? param : Number.parseInt(String(param), 10);
  if (Number.isNaN(id) || id <= 0) {
    throw new ValidationError(
      `Parameter ${fieldName} harus berupa angka positif.`,
    );
  }
  return id;
}

export function parseGetGradesQuery(query: URLSearchParams): {
  courseId: number;
  userId?: number;
  activityId?: number;
} {
  const courseId = parseCourseId(query.get("courseId"));
  const userId = parseOptionalPositiveInt(query.get("userId"), "userId");
  const activityId = parseOptionalPositiveInt(
    query.get("activityId"),
    "activityId",
  );

  return {
    courseId,
    userId,
    activityId,
  };
}
