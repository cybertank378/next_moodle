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

  it("should map invalidtoken errorcode to UnauthorizedError", () => {
    const error = MoodleErrorMapper.fromMoodleException({
      exception: "moodle_exception",
      errorcode: "invalidtoken",
      message: "Invalid token - token not found",
    });

    expect(error).toBeInstanceOf(UnauthorizedError);
    expect(error.message).toBe("Moodle credentials were rejected.");
  });

  it("should map invalidlogin errorcode to UnauthorizedError", () => {
    const error = MoodleErrorMapper.fromMoodleException({
      exception: "moodle_exception",
      errorcode: "invalidlogin",
      message: "Invalid login, please try again",
    });

    expect(error).toBeInstanceOf(UnauthorizedError);
    expect(error.message).toBe("Moodle credentials were rejected.");
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

  describe("session-expired error codes", () => {
    it("should map tokennotwhitelisted to UnauthorizedError with isSessionExpired", () => {
      const error = MoodleErrorMapper.fromMoodleException({
        exception: "webservice_access_exception",
        errorcode: "tokennotwhitelisted",
        message: "Token is not whitelisted",
      });
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect(error.message).toContain("Sesi Moodle");
      expect((error as UnauthorizedError).details).toHaveProperty(
        "isSessionExpired",
        true,
      );
    });

    it("should map servicerequireslogin to UnauthorizedError with isSessionExpired", () => {
      const error = MoodleErrorMapper.fromMoodleException({
        exception: "moodle_exception",
        errorcode: "servicerequireslogin",
        message: "Service requires login",
      });
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect((error as UnauthorizedError).details).toHaveProperty(
        "isSessionExpired",
        true,
      );
    });

    it("should map invalidsession to UnauthorizedError with isSessionExpired", () => {
      const error = MoodleErrorMapper.fromMoodleException({
        exception: "moodle_exception",
        errorcode: "invalidsession",
        message: "Invalid session",
      });
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect((error as UnauthorizedError).details).toHaveProperty(
        "isSessionExpired",
        true,
      );
    });

    it("should map webservice_access_exception with unknown errorcode to session expired", () => {
      const error = MoodleErrorMapper.fromMoodleException({
        exception: "webservice_access_exception",
        errorcode: "someunknowncode",
        message: "Access exception",
      });
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect((error as UnauthorizedError).details).toHaveProperty(
        "isSessionExpired",
        true,
      );
    });
  });
});
