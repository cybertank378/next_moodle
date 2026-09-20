import { describe, expect, it } from "vitest";
import { Result } from "@/core/base/Result";

describe("Result", () => {
  describe("Success", () => {
    it("should create a successful result with data", () => {
      const data = { id: "123", name: "Alice" };
      const result = Result.ok(data);

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.value).toEqual(data);
      expect(result.getValue()).toEqual(data);
    });

    it("should throw when accessing error on success result", () => {
      const result = Result.ok("ok-val");
      expect(() => result.error).toThrowError();
      expect(() => result.getError()).toThrowError();
    });
  });

  describe("Failure", () => {
    it("should create a failure result with an error", () => {
      const err = new Error("Something went wrong");
      const result = Result.fail(err);

      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe(err);
      expect(result.getError()).toBe(err);
    });

    it("should throw when accessing value on failure result", () => {
      const result = Result.fail(new Error("fail"));
      expect(() => result.value).toThrowError();
      expect(() => result.getValue()).toThrowError();
    });
  });
});
