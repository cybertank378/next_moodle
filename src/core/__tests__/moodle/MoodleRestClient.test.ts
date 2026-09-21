import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InfrastructureError, UnauthorizedError } from "@/core/errors";
import { MoodleRestClient } from "@/core/moodle/MoodleRestClient";

describe("MoodleRestClient", () => {
  const credentials = {
    baseUrl: "https://moodle.example.edu",
    token: "super_secret_wstoken_12345",
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should make POST request with correct URL, format, token, and parameters", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify([{ id: 1, fullname: "Introduction to CS" }]),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    const client = new MoodleRestClient(credentials);
    const result = await client.call("core_course_get_courses", {
      options: { ids: [1] },
    });

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, requestInit] = fetchSpy.mock.calls[0];

    expect(url.toString()).toBe(
      "https://moodle.example.edu/webservice/rest/server.php",
    );
    expect(requestInit).toBeDefined();
    expect(requestInit?.method).toBe("POST");
    const headers = requestInit?.headers as Record<string, string>;
    expect(headers["content-type"]).toBe("application/x-www-form-urlencoded");

    const bodyParams = new URLSearchParams(requestInit?.body as string);
    expect(bodyParams.get("wstoken")).toBe("super_secret_wstoken_12345");
    expect(bodyParams.get("moodlewsrestformat")).toBe("json");
    expect(bodyParams.get("wsfunction")).toBe("core_course_get_courses");
    expect(bodyParams.get("options[ids][0]")).toBe("1");

    expect(result).toEqual([{ id: 1, fullname: "Introduction to CS" }]);
  });

  it("should throw mapped AppError when Moodle returns an exception payload", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          exception: "moodle_exception",
          errorcode: "invalidtoken",
          message: "Invalid token - token not found",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    const client = new MoodleRestClient(credentials);

    await expect(client.call("core_course_get_courses", {})).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it("should throw InfrastructureError when HTTP status is not 2xx", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("Internal Server Error on LMS Web Server", {
        status: 500,
      }),
    );

    const client = new MoodleRestClient(credentials);

    await expect(client.call("core_course_get_courses", {})).rejects.toThrow(
      InfrastructureError,
    );
  });

  it("should throw InfrastructureError when request times out", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new DOMException(
        "The operation was aborted due to timeout",
        "TimeoutError",
      ),
    );

    const client = new MoodleRestClient(credentials);

    await expect(
      client.call("core_course_get_courses", {}, { timeoutMs: 100 }),
    ).rejects.toThrow(InfrastructureError);
  });

  it("should never log the secret wstoken to stdout or stderr", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const client = new MoodleRestClient(credentials);
    await client.call("core_webservice_get_site_info", {
      secretParam: "confidential_password",
    });

    const allOutput = [
      ...logSpy.mock.calls,
      ...infoSpy.mock.calls,
      ...warnSpy.mock.calls,
      ...errorSpy.mock.calls,
    ]
      .map((c) => JSON.stringify(c))
      .join(" ");

    expect(allOutput).not.toContain("super_secret_wstoken_12345");
    expect(allOutput).not.toContain("confidential_password");

    logSpy.mockRestore();
    infoSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
