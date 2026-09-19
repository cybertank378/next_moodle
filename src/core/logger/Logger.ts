export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  requestId?: string;
  tenantId?: string;
  actorId?: string;
  module?: string;
  [key: string]: unknown;
}

export interface ILogger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: unknown, context?: LogContext): void;
  child(defaultContext: LogContext): ILogger;
}

export class JsonLogger implements ILogger {
  constructor(private readonly defaultContext: LogContext = {}) {}

  private sanitize(obj: unknown): unknown {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitize(item));
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const lower = key.toLowerCase();
      if (
        lower.includes("token") ||
        lower.includes("password") ||
        lower.includes("secret") ||
        lower.includes("authorization") ||
        lower.includes("cookie")
      ) {
        sanitized[key] = "[REDACTED]";
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = this.sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: unknown,
  ): void {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.sanitize({ ...this.defaultContext, ...context }),
      ...(error
        ? {
            error:
              error instanceof Error
                ? {
                    name: error.name,
                    message: error.message,
                    stack:
                      process.env.NODE_ENV === "development"
                        ? error.stack
                        : undefined,
                  }
                : String(error),
          }
        : {}),
    };

    const output = JSON.stringify(entry);
    if (level === "error") {
      console.error(output);
    } else if (level === "warn") {
      console.warn(output);
    } else {
      console.log(output);
    }
  }

  public debug(message: string, context?: LogContext): void {
    this.log("debug", message, context);
  }

  public info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  public warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  public error(message: string, error?: unknown, context?: LogContext): void {
    this.log("error", message, context, error);
  }

  public child(defaultContext: LogContext): ILogger {
    return new JsonLogger({ ...this.defaultContext, ...defaultContext });
  }
}
