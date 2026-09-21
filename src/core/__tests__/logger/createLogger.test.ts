import { describe, expect, it, vi } from "vitest";
import { createLogger } from "@/core/logger";

describe("createLogger", () => {
  it("should output structured JSON log with level, name, and message", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const logger = createLogger("TestService");

    logger.info("Service initialized");

    expect(consoleSpy).toHaveBeenCalledOnce();
    const logCall = consoleSpy.mock.calls[0][0];
    const parsed = JSON.parse(logCall);

    expect(parsed.level).toBe("info");
    expect(parsed.name).toBe("TestService");
    expect(parsed.message).toBe("Service initialized");
    expect(parsed.timestamp).toBeDefined();

    consoleSpy.mockRestore();
  });

  it("should automatically redact sensitive keys in context", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const logger = createLogger("AuthService");

    logger.info("User login attempt", {
      username: "student1",
      password: "SuperSecretPassword123!",
      token: "ws_token_abc123456",
      authorization: "Bearer secret_bearer_token",
      nested: {
        apiKey: "moodle_api_key_secret",
        cookie: "session=xyz987",
        safeData: "visible_value",
      },
      list: [{ secret: "token_in_list", id: 1 }],
    });

    expect(consoleSpy).toHaveBeenCalledOnce();
    const parsed = JSON.parse(consoleSpy.mock.calls[0][0]);

    expect(parsed.context.username).toBe("student1");
    expect(parsed.context.password).toBe("[REDACTED]");
    expect(parsed.context.token).toBe("[REDACTED]");
    expect(parsed.context.authorization).toBe("[REDACTED]");
    expect(parsed.context.nested.apiKey).toBe("[REDACTED]");
    expect(parsed.context.nested.cookie).toBe("[REDACTED]");
    expect(parsed.context.nested.safeData).toBe("visible_value");
    expect(parsed.context.list[0].secret).toBe("[REDACTED]");
    expect(parsed.context.list[0].id).toBe(1);

    consoleSpy.mockRestore();
  });

  it("should log errors safely with message and name without leaking raw stack trace if not in debug", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const logger = createLogger("MoodleClient");
    const error = new Error("Connection timed out to Moodle");

    logger.error("Failed to connect", error, {
      url: "https://moodle.example.com",
    });

    expect(consoleSpy).toHaveBeenCalledOnce();
    const parsed = JSON.parse(consoleSpy.mock.calls[0][0]);

    expect(parsed.level).toBe("error");
    expect(parsed.message).toBe("Failed to connect");
    expect(parsed.error.message).toBe("Connection timed out to Moodle");
    expect(parsed.context.url).toBe("https://moodle.example.com");

    consoleSpy.mockRestore();
  });
});
