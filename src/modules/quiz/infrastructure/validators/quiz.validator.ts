import { ValidationError } from "@/core/errors/ValidationError";
import type { ListQuizzesQueryDTO } from "@/modules/quiz/domain/dto/QuizRequestDto";

export function parseQuizId(param: unknown): number {
  if (typeof param !== "string" && typeof param !== "number") {
    throw new ValidationError("Parameter quizId wajib diisi.");
  }
  const id = typeof param === "number" ? param : Number.parseInt(param, 10);
  if (Number.isNaN(id) || id <= 0) {
    throw new ValidationError("Parameter quizId harus berupa angka positif.");
  }
  return id;
}

export function parseListQuizzesQuery(
  searchParams: URLSearchParams,
): ListQuizzesQueryDTO {
  const courseIdParam = searchParams.get("courseId");
  let courseId: number | undefined;

  if (courseIdParam) {
    const parsed = Number.parseInt(courseIdParam, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      courseId = parsed;
    }
  }

  const search = searchParams.get("search")?.trim() || undefined;

  return {
    courseId,
    search,
  };
}
