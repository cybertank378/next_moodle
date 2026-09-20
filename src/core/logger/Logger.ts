import { SensitiveData } from "@/core/security/SensitiveData";
import type { LogContext } from "./LogContext";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: unknown, context?: LogContext): void;
  child(defaultContext: LogContext): Logger;
}

export type ILogger = Logger;

export class JsonLogger implements Logger {
  constructor(private readonly defaultContext: LogContext = {}) {}

  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: unknown,
  ): void {
    const mergedContext = { ...this.defaultContext, ...context };
    const sanitizedContext = SensitiveData.redact(mergedContext) as LogContext;

    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: sanitizedContext,
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

  public child(defaultContext: LogContext): Logger {
    return new JsonLogger({ ...this.defaultContext, ...defaultContext });
  }
}
