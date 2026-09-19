import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InfrastructureError } from "../../errors/InfrastructureError";
import { MoodleError } from "../../errors/MoodleError";
import type { ILogger } from "../../logger";
import { encodeMoodleParams, MoodleRestClient } from "../MoodleRestClient";

describe("MoodleRestClient", () => {
  const dummyUrl = "https://moodle.example.com";
  const dummyToken = "secret_token_12345";

  let mockLogger: ILogger;

  beforeEach(() => {
    vi.restoreAllMocks();
    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      child: vi.fn().mockImplementation(() => mockLogger),
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("Parameter Encoding", () => {
    it("should correctly encode scalar parameters", () => {
      const params = {
        userid: 42,
        include_all: true,
        keyword: "biology",
      };
      const encoded = encodeMoodleParams(params);
      expect(encoded.get("userid")).toBe("42");
      expect(encoded.get("include_all")).toBe("true");
      expect(encoded.get("keyword")).toBe("biology");
    });

    it("should correctly encode array parameters", () => {
      const params = {
        courseids: [10, 20, 30],
      };
      const encoded = encodeMoodleParams(params);
      expect(encoded.get("courseids[0]")).toBe("10");
      expect(encoded.get("courseids[1]")).toBe("20");
      expect(encoded.get("courseids[2]")).toBe("30");
    });

    it("should correctly encode deeply nested objects and arrays", () => {
      const params = {
        criteria: [
          { key: "category", value: "science" },
          { key: "tag", value: "final" },
        ],
      };
      const encoded = encodeMoodleParams(params);
      expect(encoded.get("criteria[0][key]")).toBe("category");
      expect(encoded.get("criteria[0][value]")).toBe("science");
      expect(encoded.get("criteria[1][key]")).toBe("tag");
      expect(encoded.get("criteria[1][value]")).toBe("final");
    });
  });

  describe("API Execution & Responses", () => {
    it("should successfully parse and return JSON response for valid call", async () => {
      const mockCourses = [
        { id: 1, fullname: "Matematika Dasar", shortname: "MATH101" },
      ];

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => mockCourses,
        }),
      );

      const client = new MoodleRestClient({
        baseUrl: dummyUrl,
        token: dummyToken,
        logger: mockLogger,
      });

      const result = await client.call<typeof mockCourses>(
        "core_course_get_courses",
      );
      expect(result).toEqual(mockCourses);
    });

    it("should map Moodle exception responses to MoodleError", async () => {
      const moodleException = {
        exception: "moodle_exception",
        errorcode: "invalidtoken",
        message: "Invalid token - token not found",
      };

      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: async () => moodleException,
        }),
      );

      const client = new MoodleRestClient({
        baseUrl: dummyUrl,
        token: dummyToken,
        logger: mockLogger,
      });

      await expect(client.call("core_user_get_users")).rejects.toThrow(
        MoodleError,
      );
    });

    it("should throw InfrastructureError when HTTP status is not ok", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({
          ok: false,
          status: 502,
          statusText: "Bad Gateway",
        }),
      );

      const client = new MoodleRestClient({
        baseUrl: dummyUrl,
        token: dummyToken,
        logger: mockLogger,
      });

      await expect(client.call("core_course_get_courses")).rejects.toThrow(
        InfrastructureError,
      );
    });

    it("should handle request timeout using AbortController", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockImplementation((_url, options) => {
          return new Promise((_resolve, reject) => {
            options.signal.addEventListener("abort", () => {
              const abortError = new Error("The operation was aborted");
              abortError.name = "AbortError";
              reject(abortError);
            });
          });
        }),
      );

      const client = new MoodleRestClient({
        baseUrl: dummyUrl,
        token: dummyToken,
        timeoutMs: 50,
        logger: mockLogger,
      });

      await expect(client.call("core_course_get_courses")).rejects.toThrow(
        InfrastructureError,
      );
    });
  });
});
