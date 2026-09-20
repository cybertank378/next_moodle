import { MoodleError } from "../errors/MoodleError";
import type { MoodleExceptionResponse } from "./types/MoodleExceptionResponse";

export interface MoodleErrorContext {
  readonly requestId?: string;
  readonly tenantId?: string;
}

export const MoodleErrorMapper = {
  mapException(
    exception: MoodleExceptionResponse,
    context?: MoodleErrorContext,
  ): MoodleError {
    const errorcode = exception.errorcode.toLowerCase();
    const moodleException = exception.exception;
    const requestId = context?.requestId;

    switch (errorcode) {
      case "invalidtoken":
      case "invalidtokenexpired":
      case "invalid_token":
        return new MoodleError({
          code: "MOODLE_INVALID_TOKEN",
          message:
            "Sesi komunikasi LMS Moodle kedaluwarsa atau token tidak valid.",
          statusCode: 401,
          moodleErrorCode: exception.errorcode,
          moodleException,
          requestId,
        });

      case "accessexception":
      case "accesscontrol":
      case "nopermissions":
        return new MoodleError({
          code: "MOODLE_FORBIDDEN",
          message: "Akses ke sumber daya Moodle ditolak.",
          statusCode: 403,
          moodleErrorCode: exception.errorcode,
          moodleException,
          requestId,
        });

      case "dml_missing_record_exception":
      case "usernotfound":
      case "coursenotfound":
        return new MoodleError({
          code: "MOODLE_NOT_FOUND",
          message: "Data yang diminta tidak ditemukan di Moodle.",
          statusCode: 404,
          moodleErrorCode: exception.errorcode,
          moodleException,
          requestId,
        });

      case "invalidparameter":
      case "invalid_parameter_exception":
      case "invalidrecord":
        return new MoodleError({
          code: "MOODLE_INVALID_PARAMETER",
          message: "Parameter yang dikirim ke Moodle tidak sesuai format.",
          statusCode: 400,
          moodleErrorCode: exception.errorcode,
          moodleException,
          requestId,
        });

      case "dmlreadexception":
      case "dmlwriteexception":
        return new MoodleError({
          code: "MOODLE_EXCEPTION",
          message: "Terjadi kesalahan internal basis data pada Moodle LMS.",
          statusCode: 502,
          moodleErrorCode: exception.errorcode,
          moodleException,
          requestId,
        });

      default:
        return new MoodleError({
          code: "MOODLE_EXCEPTION",
          message:
            exception.message || "Terjadi kesalahan pada integrasi Moodle LMS.",
          statusCode: 502,
          moodleErrorCode: exception.errorcode,
          moodleException,
          requestId,
        });
    }
  },

  mapHttpError(
    status: number,
    statusText?: string,
    context?: MoodleErrorContext,
  ): MoodleError {
    const requestId = context?.requestId;

    switch (status) {
      case 400:
        return new MoodleError({
          code: "MOODLE_INVALID_PARAMETER",
          message: statusText || "Bad request to Moodle REST API",
          statusCode: 400,
          requestId,
        });

      case 401:
        return new MoodleError({
          code: "MOODLE_INVALID_TOKEN",
          message: statusText || "Unauthorized access to Moodle REST API",
          statusCode: 401,
          requestId,
        });

      case 403:
        return new MoodleError({
          code: "MOODLE_FORBIDDEN",
          message: statusText || "Forbidden access to Moodle REST API",
          statusCode: 403,
          requestId,
        });

      case 404:
        return new MoodleError({
          code: "MOODLE_REQUEST_FAILED",
          message: statusText || "Moodle endpoint not found",
          statusCode: 404,
          requestId,
        });

      case 429:
        return new MoodleError({
          code: "MOODLE_RATE_LIMITED",
          message: statusText || "Too many requests to Moodle REST API",
          statusCode: 429,
          requestId,
        });

      case 502:
        return new MoodleError({
          code: "MOODLE_BAD_GATEWAY",
          message: statusText || "Moodle upstream gateway error",
          statusCode: 502,
          requestId,
        });

      case 503:
        return new MoodleError({
          code: "MOODLE_UNAVAILABLE",
          message: statusText || "Moodle LMS service temporarily unavailable",
          statusCode: 503,
          requestId,
        });

      default:
        return new MoodleError({
          code: "MOODLE_REQUEST_FAILED",
          message: statusText || `Moodle request failed with HTTP ${status}`,
          statusCode: status >= 400 && status < 600 ? status : 502,
          requestId,
        });
    }
  },

  mapTimeoutError(
    timeoutMs: number,
    context?: MoodleErrorContext,
  ): MoodleError {
    return new MoodleError({
      code: "MOODLE_TIMEOUT",
      message: `Moodle request timed out after ${timeoutMs}ms`,
      statusCode: 504,
      requestId: context?.requestId,
    });
  },

  mapNetworkError(error: unknown, context?: MoodleErrorContext): MoodleError {
    return new MoodleError({
      code: "MOODLE_NETWORK_ERROR",
      message: "Gagal terhubung ke Moodle LMS melalui jaringan.",
      statusCode: 502,
      requestId: context?.requestId,
      cause: error,
    });
  },

  mapInvalidResponse(
    error: unknown,
    context?: MoodleErrorContext,
  ): MoodleError {
    return new MoodleError({
      code: "MOODLE_INVALID_RESPONSE",
      message:
        "Respon dari Moodle LMS tidak valid atau bukan format JSON yang diharapkan.",
      statusCode: 502,
      requestId: context?.requestId,
      cause: error,
    });
  },
};
