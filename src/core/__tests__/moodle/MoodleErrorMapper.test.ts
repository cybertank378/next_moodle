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
    expect(error.message).toContain("token not found");
  });

  it("should map invalidlogin errorcode to UnauthorizedError", () => {
    const error = MoodleErrorMapper.fromMoodleException({
      exception: "moodle_exception",
      errorcode: "invalidlogin",
      message: "Invalid login, please try again",
    });

    expect(error).toBeInstanceOf(UnauthorizedError);
    expect(error.message).toContain("Invalid login");
  });

  it("should map nopermissions or accessdenied to ForbiddenError", () => {
    const error = MoodleErrorMapper.fromMoodleException({
      exception: "required_capability_exception",
      errorcode: "nopermissions",
      message: "Sorry, but you do not currently have permissions to do that",
    });

    expect(error).toBeInstanceOf(ForbiddenError);
    expect(error.message).toContain("permissions");
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
  });

  it("should map HTTP non-200 status to InfrastructureError", () => {
    const error = MoodleErrorMapper.fromHttpStatus(
      502,
      "Bad Gateway from LMS reverse proxy",
    );
    expect(error).toBeInstanceOf(InfrastructureError);
    expect(error.statusCode).toBe(500);
  });
});
