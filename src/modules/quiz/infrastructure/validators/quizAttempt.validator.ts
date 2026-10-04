import { ValidationError } from "@/core/errors/ValidationError";
import type { AnswerInputPayload } from "../../domain/dto/QuizAttemptRequestDto";

export function parseAttemptId(param: unknown): number {
  if (typeof param !== "string" && typeof param !== "number") {
    throw new ValidationError("Parameter attemptId wajib diisi.");
  }
  const id = typeof param === "number" ? param : Number.parseInt(param, 10);
  if (Number.isNaN(id) || id <= 0) {
    throw new ValidationError(
      "Parameter attemptId harus berupa angka positif.",
    );
  }
  return id;
}

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

export function parseStartAttemptBody(body: unknown): {
  quizId: number;
  forceNew?: boolean;
} {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Request body tidak valid.");
  }

  const record = body as Record<string, unknown>;
  const quizId = parseQuizId(record.quizId);
  const forceNew =
    typeof record.forceNew === "boolean" ? record.forceNew : undefined;

  return { quizId, forceNew };
}

export function parseSaveAnswerBody(body: unknown): {
  answers: AnswerInputPayload;
  quizId?: number;
} {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Request body tidak valid.");
  }

  const record = body as Record<string, unknown>;
  if (!record.answers || typeof record.answers !== "object") {
    throw new ValidationError("Field 'answers' wajib disertakan.");
  }

  const quizId =
    record.quizId !== undefined ? parseQuizId(record.quizId) : undefined;

  return {
    answers: record.answers as AnswerInputPayload,
    quizId,
  };
}

export function parseSubmitAttemptBody(body: unknown): {
  answers?: AnswerInputPayload;
  quizId?: number;
  timeUp?: boolean;
} {
  if (!body || typeof body !== "object") {
    return {};
  }

  const record = body as Record<string, unknown>;
  const quizId =
    record.quizId !== undefined ? parseQuizId(record.quizId) : undefined;
  const timeUp = typeof record.timeUp === "boolean" ? record.timeUp : undefined;
  const answers =
    record.answers && typeof record.answers === "object"
      ? (record.answers as AnswerInputPayload)
      : undefined;

  return {
    answers,
    quizId,
    timeUp,
  };
}

export function parseGetUserAttemptsQuery(searchParams: URLSearchParams): {
  quizId: number;
  status?: "all" | "finished" | "unfinished";
} {
  const quizIdParam = searchParams.get("quizId");
  if (!quizIdParam) {
    throw new ValidationError("Query parameter quizId wajib diisi.");
  }

  const quizId = parseQuizId(quizIdParam);
  const statusParam = searchParams.get("status");
  let status: "all" | "finished" | "unfinished" | undefined;

  if (
    statusParam === "all" ||
    statusParam === "finished" ||
    statusParam === "unfinished"
  ) {
    status = statusParam;
  }

  return { quizId, status };
}

export function parseGetAttemptDataQuery(searchParams: URLSearchParams): {
  page: number;
} {
  const pageParam = searchParams.get("page");
  if (!pageParam) {
    return { page: 0 };
  }

  const page = Number.parseInt(pageParam, 10);
  if (Number.isNaN(page) || page < 0) {
    return { page: 0 };
  }

  return { page };
}
