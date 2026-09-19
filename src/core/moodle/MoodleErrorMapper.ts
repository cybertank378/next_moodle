import { MoodleError } from "../errors/MoodleError";
import type { MoodleExceptionResponse } from "./types/MoodleExceptionResponse";

export const MoodleErrorMapper = {
  mapException(exception: MoodleExceptionResponse): MoodleError {
    switch (exception.errorcode) {
      case "invalidtoken":
      case "invalidtokenexpired":
        return new MoodleError({
          code: "MOODLE_INVALID_TOKEN",
          message:
            "Sesi komunikasi LMS Moodle kedaluwarsa atau token tidak valid.",
          statusCode: 401,
          moodleErrorCode: exception.errorcode,
          details: { exception: exception.exception },
        });

      case "accessexception":
      case "nopermissions":
        return new MoodleError({
          code: "MOODLE_FORBIDDEN",
          message: "Akses ke sumber daya Moodle ditolak.",
          statusCode: 403,
          moodleErrorCode: exception.errorcode,
          details: { exception: exception.exception },
        });

      case "dml_missing_record_exception":
      case "usernotfound":
      case "coursenotfound":
        return new MoodleError({
          code: "MOODLE_NOT_FOUND",
          message: "Data yang diminta tidak ditemukan di Moodle.",
          statusCode: 404,
          moodleErrorCode: exception.errorcode,
          details: { exception: exception.exception },
        });

      case "invalidparameter":
      case "invalidrecord":
        return new MoodleError({
          code: "MOODLE_INVALID_PARAMETER",
          message: "Parameter yang dikirim ke Moodle tidak sesuai format.",
          statusCode: 400,
          moodleErrorCode: exception.errorcode,
          details: { exception: exception.exception },
        });

      default:
        return new MoodleError({
          code: `MOODLE_${exception.errorcode.toUpperCase().replace(/[^A-Z0-9_]/g, "_")}`,
          message:
            exception.message || "Terjadi kesalahan pada integrasi Moodle LMS.",
          statusCode: 502,
          moodleErrorCode: exception.errorcode,
          details: { exception: exception.exception },
        });
    }
  },
};
