import {
  type AppError,
  ForbiddenError,
  InfrastructureError,
  MoodleError,
  UnauthorizedError,
} from "@/core/errors";
import type { MoodleRawException } from "./types";

export function isMoodleException(
  payload: unknown,
): payload is MoodleRawException {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return false;
  }

  const obj = payload as Record<string, unknown>;
  return (
    typeof obj.exception === "string" ||
    typeof obj.errorcode === "string" ||
    (typeof obj.message === "string" && typeof obj.errorcode !== "undefined")
  );
}

export function fromMoodleException(exception: MoodleRawException): AppError {
  const errorcode = exception.errorcode?.toLowerCase();
  const exceptionName = exception.exception?.toLowerCase();
  const message = exception.message || "Moodle upstream error";

  if (errorcode === "invalidtoken" || errorcode === "invalidlogin") {
    return new UnauthorizedError(message, {
      moodleErrorCode: exception.errorcode,
      exception: exception.exception,
    });
  }

  if (
    errorcode === "nopermissions" ||
    errorcode === "accessdenied" ||
    exceptionName === "required_capability_exception" ||
    exceptionName === "moodle_nopermissions_exception"
  ) {
    return new ForbiddenError(message, {
      moodleErrorCode: exception.errorcode,
      exception: exception.exception,
    });
  }

  return new MoodleError(exception.errorcode, message, {
    exception: exception.exception,
    debuginfo: exception.debuginfo,
  });
}

export function fromHttpStatus(status: number, message?: string): AppError {
  const detailsMessage = message
    ? `Moodle HTTP error (${status}): ${message}`
    : `Moodle upstream HTTP request failed with status ${status}`;

  return new InfrastructureError(detailsMessage, { status });
}

export const MoodleErrorMapper = {
  isMoodleException,
  fromMoodleException,
  fromHttpStatus,
};
