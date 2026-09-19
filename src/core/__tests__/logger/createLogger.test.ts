import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createLogger } from "../../logger/createLogger";

describe("Structured Logger & Sensitive Data Redaction", () => {
  let loggedOutput: string[] = [];

  beforeEach(() => {
    loggedOutput = [];
    vi.spyOn(console, "log").mockImplementation((msg) => {
      loggedOutput.push(msg);
    });
    vi.spyOn(console, "warn").mockImplementation((msg) => {
      loggedOutput.push(msg);
    });
    vi.spyOn(console, "error").mockImplementation((msg) => {
      loggedOutput.push(msg);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should output structured JSON log with context", () => {
    const logger = createLogger({ requestId: "req-1", tenantId: "tenant-1" });
    logger.info("Test message", { event: "login_attempt", actorId: "usr-42" });

    expect(loggedOutput).toHaveLength(1);
    const parsed = JSON.parse(loggedOutput[0] ?? "{}");

    expect(parsed.level).toBe("info");
    expect(parsed.message).toBe("Test message");
    expect(parsed.context.requestId).toBe("req-1");
    expect(parsed.context.tenantId).toBe("tenant-1");
    expect(parsed.context.actorId).toBe("usr-42");
    expect(parsed.context.event).toBe("login_attempt");
  });

  it("should merge context with child logger", () => {
    const parent = createLogger({ requestId: "req-parent" });
    const child = parent.child({
      tenantId: "tenant-child",
      actorId: "actor-child",
    });
    child.info("Child log");

    const parsed = JSON.parse(loggedOutput[0] ?? "{}");
    expect(parsed.context.requestId).toBe("req-parent");
    expect(parsed.context.tenantId).toBe("tenant-child");
    expect(parsed.context.actorId).toBe("actor-child");
  });

  it("should redact sensitive keys in context (password, token, wstoken, secret, etc.)", () => {
    const logger = createLogger();
    logger.info("Sensitive transaction", {
      password: "supersecretpassword",
      token: "bearer-token-12345",
      wstoken: "moodle-wstoken-999",
      secret: "api-secret-key",
      nested: {
        refreshToken: "refresh-token-value",
        apiKey: "xyz-api-key",
        normalKey: "visible-value",
      },
    });

    const parsed = JSON.parse(loggedOutput[0] ?? "{}");
    expect(parsed.context.password).toBe("[REDACTED]");
    expect(parsed.context.token).toBe("[REDACTED]");
    expect(parsed.context.wstoken).toBe("[REDACTED]");
    expect(parsed.context.secret).toBe("[REDACTED]");
    expect(parsed.context.nested.refreshToken).toBe("[REDACTED]");
    expect(parsed.context.nested.apiKey).toBe("[REDACTED]");
    expect(parsed.context.nested.normalKey).toBe("visible-value");
  });
});
