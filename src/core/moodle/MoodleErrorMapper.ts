import type { AppError } from "@/core/errors/AppError";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { InfrastructureError } from "@/core/errors/InfrastructureError";
import { MoodleError } from "@/core/errors/MoodleError";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import type { MoodleRawException } from "@/core/moodle/types";

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

  // Token invalid / login rejected — upstream Moodle auth failure (502 MOODLE_ERROR)
  // Must NOT map to 401 UnauthorizedError because Next.js session is valid
  // and 401 triggers an unintended global redirect to /login.
  if (
    errorcode === "invalidtoken" ||
    errorcode === "invalidlogin" ||
    errorcode === "tokennotwhitelisted" ||
    errorcode === "servicerequireslogin" ||
    errorcode === "invalidsession" ||
    exceptionName === "webservice_access_exception"
  ) {
    return new MoodleError(
      exception.errorcode,
      "Kredensial atau token Moodle tidak valid atau ditolak oleh server Moodle.",
      {
        moodleErrorCode: exception.errorcode,
        isUpstreamAuthError: true,
      },
    );
  }

  if (
    errorcode === "nopermissions" ||
    errorcode === "accessdenied" ||
    exceptionName === "required_capability_exception" ||
    exceptionName === "moodle_nopermissions_exception"
  ) {
    return new ForbiddenError("Moodle denied this operation.", {
      moodleErrorCode: exception.errorcode,
    });
  }

  return new MoodleError(
    exception.errorcode,
    "Moodle returned an upstream error.",
  );
}

export function fromHttpStatus(
  status: number,
  _upstreamBody?: string,
): AppError {
  return new InfrastructureError("Moodle transport request failed.", {
    status,
  });
}

export const MoodleErrorMapper = {
  isMoodleException,
  fromMoodleException,
  fromHttpStatus,
};
