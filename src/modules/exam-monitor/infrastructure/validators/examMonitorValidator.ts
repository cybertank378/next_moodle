import { ValidationError } from "@/core/errors/ValidationError";

export function parseGetExamMonitorQuery(searchParams: URLSearchParams) {
  const quizIdParam = searchParams.get("quizId");
  if (!quizIdParam) {
    throw new ValidationError("quizId harus disertakan di query parameter.");
  }
  const quizId = Number(quizIdParam);
  if (!Number.isInteger(quizId) || quizId <= 0) {
    throw new ValidationError(
      "Parameter 'quizId' harus bilangan bulat positif.",
    );
  }
  return { quizId };
}

export function parseExamMonitorActionBody(body: any) {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Body request tidak valid.");
  }
  const attemptId = Number(body.attemptId);
  if (!Number.isInteger(attemptId) || attemptId <= 0) {
    throw new ValidationError(
      "Parameter 'attemptId' harus bilangan bulat positif.",
    );
  }
  return { attemptId };
}

export function parseExtendTimeBody(body: any) {
  const base = parseExamMonitorActionBody(body);
  const extraTimeMinutes = Number(body.extraTimeMinutes);
  if (!Number.isInteger(extraTimeMinutes) || extraTimeMinutes <= 0) {
    throw new ValidationError(
      "Parameter 'extraTimeMinutes' harus bilangan bulat positif.",
    );
  }
  return { attemptId: base.attemptId, extraTimeMinutes };
}
