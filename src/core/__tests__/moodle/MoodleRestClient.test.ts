import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MoodleError } from "@/core/errors/MoodleError";
import type { ILogger } from "@/core/logger";
import { MoodleRestClient } from "@/core/moodle/MoodleRestClient";

describe("MoodleRestClient", () => {
  const dummyBaseUrl = "https://moodle.example.test";
  const dummyToken = "secret_moodle_token_xyz987";
  const tenantId = "tenant_alpha";
  const requestId = "req_12345";

  let mockLogger: ILogger;
  let loggedEntries: Array<{
    message: string;
    context?: Record<string, unknown>;
    error?: unknown;
  }>;

  beforeEach(() => {
    vi.restoreAllMocks();
    loggedEntries = [];
    mockLogger = {
      debug: vi.fn((msg, ctx) => {
        loggedEntries.push({ message: msg, context: ctx });
      }),
      info: vi.fn((msg, ctx) => {
        loggedEntries.push({ message: msg, context: ctx });
      }),
      warn: vi.fn((msg, ctx) => {
        loggedEntries.push({ message: msg, context: ctx });
      }),
      error: vi.fn((msg, err, ctx) => {
        loggedEntries.push({ message: msg, error: err, context: ctx });
      }),
      child: vi.fn().mockImplementation(() => mockLogger),
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("Constructor & URL Security / Normalization", () => {
    it("should reject invalid or dangerous URL schemes", () => {
      expect(
        () =>
          new MoodleRestClient({
            baseUrl: "ftp://moodle.example.test",
            token: dummyToken,
          }),
      ).toThrow(/invalid.*scheme/i);

      expect(
        () =>
          new MoodleRestClient({
            baseUrl: "javascript:alert(1)",
            token: dummyToken,
          }),
      ).toThrow(/invalid.*scheme/i);

      expect(
        () =>
          new MoodleRestClient({
            baseUrl: "file:///etc/passwd",
            token: dummyToken,
          }),
      ).toThrow(/invalid.*scheme/i);
    });

    it("should normalize trailing slashes on base URL to avoid double slash", async () => {
      let capturedUrl = "";
      const mockFetcher = vi.fn().mockImplementation(async (url: string) => {
        capturedUrl = url;
        return new Response(JSON.stringify({ sitename: "Test Moodle" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      });

      const client = new MoodleRestClient({
        baseUrl: "https://moodle.example.test///",
        token: dummyToken,
        fetcher: mockFetcher,
      });

      await client.call("core_webservice_get_site_info");
      expect(capturedUrl).toBe(
        "https://moodle.example.test/webservice/rest/server.php",
      );
    });

    it("should throw if baseUrl or token is missing", () => {
      expect(
        () => new MoodleRestClient({ baseUrl: "", token: dummyToken }),
      ).toThrow();
      expect(
        () => new MoodleRestClient({ baseUrl: dummyBaseUrl, token: "" }),
      ).toThrow();
    });
  });

  describe("REST Request Contract", () => {
    it("should execute POST with urlencoded body, internal token, wsfunction, and json format", async () => {
      let capturedInit: RequestInit | undefined;
      let capturedUrl = "";

      const mockFetcher = vi
        .fn()
        .mockImplementation(async (url: string, init?: RequestInit) => {
          capturedUrl = url;
          capturedInit = init;
          return new Response(JSON.stringify({ status: "success" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        });

      const client = new MoodleRestClient({
        baseUrl: dummyBaseUrl,
        token: dummyToken,
        fetcher: mockFetcher,
        requestId,
        tenantId,
      });

      const result = await client.call<{ status: string }>(
        "mod_quiz_get_quizzes_by_courses",
        {
          courseids: [10, 20],
          finishattempt: true,
          preview: false,
          offset: 0,
        },
      );

      expect(result).toEqual({ status: "success" });
      expect(capturedInit?.method).toBe("POST");
      expect(capturedUrl).toBe(
        "https://moodle.example.test/webservice/rest/server.php",
      );

      // Verify Headers
      const headers = capturedInit?.headers as Record<string, string>;
      expect(headers["Content-Type"]).toBe("application/x-www-form-urlencoded");
      expect(headers.Accept).toBe("application/json");
      expect(headers["X-Request-Id"]).toBe(requestId);

      // Verify Body parameters
      const body = new URLSearchParams(capturedInit?.body as string);
      expect(body.get("wstoken")).toBe(dummyToken);
      expect(body.get("wsfunction")).toBe("mod_quiz_get_quizzes_by_courses");
      expect(body.get("moodlewsrestformat")).toBe("json");
      expect(body.get("courseids[0]")).toBe("10");
      expect(body.get("courseids[1]")).toBe("20");
      expect(body.get("finishattempt")).toBe("1");
      expect(body.get("preview")).toBe("0");
      expect(body.get("offset")).toBe("0");
    });
  });

  describe("Response & Error Normalization", () => {
    it("should detect Moodle exception payload even when HTTP status is 200", async () => {
      const moodleException = {
        exception: "moodle_exception",
        errorcode: "invalidtoken",
        message: "Invalid token - token not found",
        debuginfo: "Sensitive server stack trace",
      };

      const mockFetcher = vi.fn().mockImplementation(
        async () =>
          new Response(JSON.stringify(moodleException), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
      );

      const client = new MoodleRestClient({
        baseUrl: dummyBaseUrl,
        token: dummyToken,
        fetcher: mockFetcher,
      });

      await expect(client.call("core_user_get_users")).rejects.toThrow(
        MoodleError,
      );

      try {
        await client.call("core_user_get_users");
      } catch (err) {
        expect(err).toBeInstanceOf(MoodleError);
        const moodleErr = err as MoodleError;
        expect(moodleErr.code).toBe("MOODLE_INVALID_TOKEN");
        expect(moodleErr.statusCode).toBe(401);
        expect(moodleErr.moodleErrorCode).toBe("invalidtoken");
        // Must NOT expose debuginfo
        expect(JSON.stringify(moodleErr)).not.toContain(
          "Sensitive server stack trace",
        );
      }
    });

    it("should normalize HTTP non-200 responses to safe MoodleError", async () => {
      const mockFetcher = vi.fn().mockImplementation(
        async () =>
          new Response("Bad Gateway from Cloudflare", {
            status: 502,
            statusText: "Bad Gateway",
          }),
      );

      const client = new MoodleRestClient({
        baseUrl: dummyBaseUrl,
        token: dummyToken,
        fetcher: mockFetcher,
      });

      await expect(client.call("core_course_get_courses")).rejects.toThrow(
        MoodleError,
      );

      try {
        await client.call("core_course_get_courses");
      } catch (err) {
        const moodleErr = err as MoodleError;
        expect(moodleErr.code).toBe("MOODLE_BAD_GATEWAY");
        expect(moodleErr.statusCode).toBe(502);
      }
    });

    it("should abort on timeout and normalize to MOODLE_TIMEOUT", async () => {
      const mockFetcher = vi.fn().mockImplementation((_url, options) => {
        return new Promise((_resolve, reject) => {
          options?.signal?.addEventListener("abort", () => {
            const abortErr = new Error("The operation was aborted");
            abortErr.name = "AbortError";
            reject(abortErr);
          });
        });
      });

      const client = new MoodleRestClient({
        baseUrl: dummyBaseUrl,
        token: dummyToken,
        timeoutMs: 50,
        fetcher: mockFetcher,
      });

      try {
        await client.call("core_course_get_courses");
        expect.fail("Expected call to throw");
      } catch (err) {
        expect(err).toBeInstanceOf(MoodleError);
        const moodleErr = err as MoodleError;
        expect(moodleErr.code).toBe("MOODLE_TIMEOUT");
        expect(moodleErr.statusCode).toBe(504);
        expect(moodleErr.message).toContain("50ms");
      }
    });

    it("should normalize invalid JSON responses to MOODLE_INVALID_RESPONSE", async () => {
      const mockFetcher = vi.fn().mockResolvedValue(
        new Response("<html><body>502 Bad Gateway Nginx</body></html>", {
          status: 200,
          headers: { "Content-Type": "text/html" },
        }),
      );

      const client = new MoodleRestClient({
        baseUrl: dummyBaseUrl,
        token: dummyToken,
        fetcher: mockFetcher,
      });

      try {
        await client.call("core_course_get_courses");
        expect.fail("Expected call to throw");
      } catch (err) {
        expect(err).toBeInstanceOf(MoodleError);
        const moodleErr = err as MoodleError;
        expect(moodleErr.code).toBe("MOODLE_INVALID_RESPONSE");
        expect(moodleErr.statusCode).toBe(502);
      }
    });

    it("should normalize network connection failures to MOODLE_NETWORK_ERROR", async () => {
      const mockFetcher = vi
        .fn()
        .mockRejectedValue(new TypeError("fetch failed: connect ECONNREFUSED"));

      const client = new MoodleRestClient({
        baseUrl: dummyBaseUrl,
        token: dummyToken,
        fetcher: mockFetcher,
      });

      try {
        await client.call("core_course_get_courses");
        expect.fail("Expected call to throw");
      } catch (err) {
        expect(err).toBeInstanceOf(MoodleError);
        const moodleErr = err as MoodleError;
        expect(moodleErr.code).toBe("MOODLE_NETWORK_ERROR");
        expect(moodleErr.statusCode).toBe(502);
      }
    });
  });

  describe("Secret-Safe Structured Logging", () => {
    it("should log request lifecycle events with duration and safe metadata", async () => {
      const mockFetcher = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ result: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );

      const client = new MoodleRestClient({
        baseUrl: dummyBaseUrl,
        token: dummyToken,
        fetcher: mockFetcher,
        logger: mockLogger,
        tenantId,
        requestId,
      });

      await client.call("core_webservice_get_site_info");

      const eventNames = loggedEntries.map((e) => e.message);
      expect(eventNames).toContain("moodle_request_started");
      expect(eventNames).toContain("moodle_request_completed");

      const completedEntry = loggedEntries.find(
        (e) => e.message === "moodle_request_completed",
      );
      expect(completedEntry?.context).toMatchObject({
        wsfunction: "core_webservice_get_site_info",
        tenantId,
        requestId,
        httpStatus: 200,
      });
      expect(typeof completedEntry?.context?.durationMs).toBe("number");

      // Verify token NEVER appears in any log entry
      for (const entry of loggedEntries) {
        const serialized = JSON.stringify(entry);
        expect(serialized).not.toContain(dummyToken);
        expect(serialized).not.toContain("wstoken");
      }
    });

    it("should log moodle_request_failed on error without exposing raw secrets", async () => {
      const mockFetcher = vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            exception: "moodle_exception",
            errorcode: "invalidtoken",
            message: "Invalid token",
            debuginfo: `Sensitive info with token ${dummyToken}`,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      );

      const client = new MoodleRestClient({
        baseUrl: dummyBaseUrl,
        token: dummyToken,
        fetcher: mockFetcher,
        logger: mockLogger,
        tenantId,
        requestId,
      });

      await expect(client.call("core_course_get_courses")).rejects.toThrow();

      const failedEntry = loggedEntries.find(
        (e) => e.message === "moodle_request_failed",
      );
      expect(failedEntry).toBeDefined();
      expect(failedEntry?.context?.errorCode).toBe("invalidtoken");
      expect(typeof failedEntry?.context?.durationMs).toBe("number");

      // Verify token is never in logs
      for (const entry of loggedEntries) {
        const serialized = JSON.stringify(entry);
        expect(serialized).not.toContain(dummyToken);
      }
    });
  });
});
