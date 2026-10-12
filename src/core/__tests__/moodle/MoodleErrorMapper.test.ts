import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { InfrastructureError } from "@/core/errors/InfrastructureError";
import { MoodleError } from "@/core/errors/MoodleError";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { MoodleErrorMapper } from "@/core/moodle/MoodleErrorMapper";

describe("MoodleErrorMapper", () => {
  it("should identify Moodle exception payloads correctly", () => {
    expect(
      MoodleErrorMapper.isMoodleException({
        exception: "moodle_exception",
        errorcode: "invalidtoken",
        message: "Invalid token",
      }),
    ).toBe(true);

    expect(
      MoodleErrorMapper.isMoodleException({
        errorcode: "general_error",
        message: "Some error",
      }),
    ).toBe(true);

    expect(
      MoodleErrorMapper.isMoodleException({ id: 1, name: "Biology" }),
    ).toBe(false);
    expect(MoodleErrorMapper.isMoodleException(null)).toBe(false);
    expect(MoodleErrorMapper.isMoodleException("plain string")).toBe(false);
  });

  it("should map invalidtoken errorcode to MoodleError with 502 status code", () => {
    const error = MoodleErrorMapper.fromMoodleException({
      exception: "moodle_exception",
      errorcode: "invalidtoken",
      message: "Invalid token - token not found",
    });

    expect(error).toBeInstanceOf(MoodleError);
    expect(error.statusCode).toBe(502);
    expect(error.code).toBe("MOODLE_ERROR");
    expect((error as MoodleError).moodleErrorCode).toBe("invalidtoken");
    expect(error.message).toContain("Moodle");
  });

  it("should map invalidlogin errorcode to MoodleError with 502 status code", () => {
    const error = MoodleErrorMapper.fromMoodleException({
      exception: "moodle_exception",
      errorcode: "invalidlogin",
      message: "Invalid login, please try again",
    });

    expect(error).toBeInstanceOf(MoodleError);
    expect(error.statusCode).toBe(502);
    expect(error.code).toBe("MOODLE_ERROR");
    expect((error as MoodleError).moodleErrorCode).toBe("invalidlogin");
    expect(error.message).toContain("Moodle");
  });

  it("should map nopermissions or accessdenied to ForbiddenError", () => {
    const error = MoodleErrorMapper.fromMoodleException({
      exception: "required_capability_exception",
      errorcode: "nopermissions",
      message: "Sorry, but you do not currently have permissions to do that",
    });

    expect(error).toBeInstanceOf(ForbiddenError);
    expect(error.message).toBe("Moodle denied this operation.");
  });

  it("should map unknown Moodle exception to MoodleError with status 502", () => {
    const error = MoodleErrorMapper.fromMoodleException({
      exception: "dml_read_exception",
      errorcode: "dmlreadexception",
      message: "Error reading from database",
    });

    expect(error).toBeInstanceOf(MoodleError);
    expect(error.code).toBe("MOODLE_ERROR");
    expect(error.statusCode).toBe(502);
    expect((error as MoodleError).moodleErrorCode).toBe("dmlreadexception");
    expect(error.message).toBe("Moodle returned an upstream error.");
    expect(JSON.stringify(error.details ?? {})).not.toContain("database");
  });

  it("should map HTTP non-200 status to InfrastructureError", () => {
    const error = MoodleErrorMapper.fromHttpStatus(
      502,
      "Bad Gateway from LMS reverse proxy",
    );
    expect(error).toBeInstanceOf(InfrastructureError);
    expect(error.statusCode).toBe(500);
    expect(error.message).not.toContain("reverse proxy");
  });

  describe("upstream session/token invalid error codes", () => {
    it("should map tokennotwhitelisted to MoodleError with 502 and isUpstreamAuthError", () => {
      const error = MoodleErrorMapper.fromMoodleException({
        exception: "webservice_access_exception",
        errorcode: "tokennotwhitelisted",
        message: "Token is not whitelisted",
      });
      expect(error).toBeInstanceOf(MoodleError);
      expect(error.statusCode).toBe(502);
      expect((error as MoodleError).details).toHaveProperty(
        "isUpstreamAuthError",
        true,
      );
    });

    it("should map servicerequireslogin to MoodleError with 502 and isUpstreamAuthError", () => {
      const error = MoodleErrorMapper.fromMoodleException({
        exception: "moodle_exception",
        errorcode: "servicerequireslogin",
        message: "Service requires login",
      });
      expect(error).toBeInstanceOf(MoodleError);
      expect(error.statusCode).toBe(502);
      expect((error as MoodleError).details).toHaveProperty(
        "isUpstreamAuthError",
        true,
      );
    });

    it("should map invalidsession to MoodleError with 502 and isUpstreamAuthError", () => {
      const error = MoodleErrorMapper.fromMoodleException({
        exception: "moodle_exception",
        errorcode: "invalidsession",
        message: "Invalid session",
      });
      expect(error).toBeInstanceOf(MoodleError);
      expect(error.statusCode).toBe(502);
      expect((error as MoodleError).details).toHaveProperty(
        "isUpstreamAuthError",
        true,
      );
    });

    it("should map webservice_access_exception with unknown errorcode to MoodleError with 502", () => {
      const error = MoodleErrorMapper.fromMoodleException({
        exception: "webservice_access_exception",
        errorcode: "someunknowncode",
        message: "Access exception",
      });
      expect(error).toBeInstanceOf(MoodleError);
      expect(error.statusCode).toBe(502);
      expect((error as MoodleError).details).toHaveProperty(
        "isUpstreamAuthError",
        true,
      );
    });
  });
});
