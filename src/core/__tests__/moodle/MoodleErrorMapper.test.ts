import { describe, expect, it } from "vitest";
import { MoodleError } from "@/core/errors/MoodleError";
import { MoodleErrorMapper } from "@/core/moodle/MoodleErrorMapper";
import type { MoodleExceptionResponse } from "@/core/moodle/types/MoodleExceptionResponse";

describe("MoodleErrorMapper", () => {
  describe("Moodle Exception Mapping", () => {
    it("should map invalidtoken / invalid_token to MOODLE_INVALID_TOKEN (401)", () => {
      const exception: MoodleExceptionResponse = {
        exception: "moodle_exception",
        errorcode: "invalidtoken",
        message: "Invalid token - token not found",
        debuginfo: "Secret trace with token wstoken=secret123",
      };

      const error = MoodleErrorMapper.mapException(exception, {
        requestId: "req-1",
      });

      expect(error).toBeInstanceOf(MoodleError);
      expect(error.code).toBe("MOODLE_INVALID_TOKEN");
      expect(error.statusCode).toBe(401);
      expect(error.moodleErrorCode).toBe("invalidtoken");
      expect(error.moodleException).toBe("moodle_exception");
      expect(error.requestId).toBe("req-1");
      // debuginfo must NOT be exposed
      expect(JSON.stringify(error)).not.toContain("Secret trace");
      expect(JSON.stringify(error)).not.toContain("debuginfo");
    });

    it("should map invalidparameter to MOODLE_INVALID_PARAMETER (400)", () => {
      const exception: MoodleExceptionResponse = {
        exception: "invalid_parameter_exception",
        errorcode: "invalidparameter",
        message: "Invalid parameter value detected",
        debuginfo: "Missing parameter userid",
      };

      const error = MoodleErrorMapper.mapException(exception);

      expect(error.code).toBe("MOODLE_INVALID_PARAMETER");
      expect(error.statusCode).toBe(400);
      expect(error.moodleErrorCode).toBe("invalidparameter");
      expect(JSON.stringify(error)).not.toContain("Missing parameter userid");
    });

    it("should map accesscontrol / nopermissions / accessexception to MOODLE_FORBIDDEN (403)", () => {
      const exception: MoodleExceptionResponse = {
        exception: "required_capability_exception",
        errorcode: "nopermissions",
        message: "Sorry, but you do not currently have permissions to do that",
      };

      const error = MoodleErrorMapper.mapException(exception);

      expect(error.code).toBe("MOODLE_FORBIDDEN");
      expect(error.statusCode).toBe(403);
    });

    it("should map dmlreadexception / dmlwriteexception to MOODLE_EXCEPTION (502)", () => {
      const exception: MoodleExceptionResponse = {
        exception: "dml_read_exception",
        errorcode: "dmlreadexception",
        message: "Error reading from database",
        debuginfo: "SELECT * FROM mdl_user WHERE ...",
      };

      const error = MoodleErrorMapper.mapException(exception);

      expect(error.code).toBe("MOODLE_EXCEPTION");
      expect(error.statusCode).toBe(502);
      expect(JSON.stringify(error)).not.toContain("SELECT * FROM mdl_user");
    });

    it("should map unknown Moodle exception to MOODLE_EXCEPTION (502)", () => {
      const exception: MoodleExceptionResponse = {
        exception: "custom_moodle_exception",
        errorcode: "some_unhandled_code",
        message: "Something broke inside Moodle",
      };

      const error = MoodleErrorMapper.mapException(exception);

      expect(error.code).toBe("MOODLE_EXCEPTION");
      expect(error.statusCode).toBe(502);
      expect(error.moodleErrorCode).toBe("some_unhandled_code");
    });
  });

  describe("HTTP Transport Error Mapping", () => {
    it("should map HTTP 400 to MOODLE_INVALID_PARAMETER", () => {
      const error = MoodleErrorMapper.mapHttpError(400, "Bad Request");
      expect(error.code).toBe("MOODLE_INVALID_PARAMETER");
      expect(error.statusCode).toBe(400);
    });

    it("should map HTTP 401 to MOODLE_INVALID_TOKEN", () => {
      const error = MoodleErrorMapper.mapHttpError(401, "Unauthorized");
      expect(error.code).toBe("MOODLE_INVALID_TOKEN");
      expect(error.statusCode).toBe(401);
    });

    it("should map HTTP 403 to MOODLE_FORBIDDEN", () => {
      const error = MoodleErrorMapper.mapHttpError(403, "Forbidden");
      expect(error.code).toBe("MOODLE_FORBIDDEN");
      expect(error.statusCode).toBe(403);
    });

    it("should map HTTP 404 to MOODLE_REQUEST_FAILED", () => {
      const error = MoodleErrorMapper.mapHttpError(404, "Not Found");
      expect(error.code).toBe("MOODLE_REQUEST_FAILED");
      expect(error.statusCode).toBe(404);
    });

    it("should map HTTP 429 to MOODLE_RATE_LIMITED", () => {
      const error = MoodleErrorMapper.mapHttpError(429, "Too Many Requests");
      expect(error.code).toBe("MOODLE_RATE_LIMITED");
      expect(error.statusCode).toBe(429);
    });

    it("should map HTTP 500 to MOODLE_REQUEST_FAILED (500)", () => {
      const error = MoodleErrorMapper.mapHttpError(
        500,
        "Internal Server Error",
      );
      expect(error.code).toBe("MOODLE_REQUEST_FAILED");
      expect(error.statusCode).toBe(500);
    });

    it("should map HTTP 502 to MOODLE_BAD_GATEWAY (502)", () => {
      const error = MoodleErrorMapper.mapHttpError(502, "Bad Gateway");
      expect(error.code).toBe("MOODLE_BAD_GATEWAY");
      expect(error.statusCode).toBe(502);
    });

    it("should map HTTP 503 to MOODLE_UNAVAILABLE (503)", () => {
      const error = MoodleErrorMapper.mapHttpError(503, "Service Unavailable");
      expect(error.code).toBe("MOODLE_UNAVAILABLE");
      expect(error.statusCode).toBe(503);
    });
  });

  describe("Timeout, Network & Response Parsing Mappers", () => {
    it("should map timeout to MOODLE_TIMEOUT (504)", () => {
      const error = MoodleErrorMapper.mapTimeoutError(5000, {
        requestId: "req-timeout",
      });
      expect(error.code).toBe("MOODLE_TIMEOUT");
      expect(error.statusCode).toBe(504);
      expect(error.message).toContain("5000ms");
      expect(error.requestId).toBe("req-timeout");
    });

    it("should map network error to MOODLE_NETWORK_ERROR (502)", () => {
      const nativeError = new TypeError("fetch failed: ECONNREFUSED");
      const error = MoodleErrorMapper.mapNetworkError(nativeError, {
        requestId: "req-net",
      });
      expect(error.code).toBe("MOODLE_NETWORK_ERROR");
      expect(error.statusCode).toBe(502);
      expect(error.cause).toBe(nativeError);
      expect(error.requestId).toBe("req-net");
    });

    it("should map invalid JSON response to MOODLE_INVALID_RESPONSE (502)", () => {
      const syntaxError = new SyntaxError(
        "Unexpected token < in JSON at position 0",
      );
      const error = MoodleErrorMapper.mapInvalidResponse(syntaxError, {
        requestId: "req-json",
      });
      expect(error.code).toBe("MOODLE_INVALID_RESPONSE");
      expect(error.statusCode).toBe(502);
      expect(error.cause).toBe(syntaxError);
      expect(error.requestId).toBe("req-json");
    });
  });
});
