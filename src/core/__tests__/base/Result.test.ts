import { describe, expect, it } from "vitest";
import { Result } from "@/core/base/Result";

describe("Result", () => {
  it("should create a successful result", () => {
    const result = Result.ok<string>("success-value");

    expect(result.isSuccess).toBe(true);
    expect(result.isFailure).toBe(false);
    expect(result.getValue()).toBe("success-value");
  });

  it("should create a failed result", () => {
    const error = new Error("failure-reason");
    const result = Result.fail<string, Error>(error);

    expect(result.isSuccess).toBe(false);
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe(error);
  });

  it("should throw error when accessing value of a failed result", () => {
    const result = Result.fail("error");

    expect(() => result.getValue()).toThrowError(
      "Cannot retrieve value from a failed result.",
    );
  });

  it("should throw error when accessing error of a successful result", () => {
    const result = Result.ok("data");

    expect(() => result.getError()).toThrowError(
      "Cannot retrieve error from a successful result.",
    );
  });
});
