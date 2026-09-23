import { redactSensitiveData } from "@/core/security/SensitiveData";
import type { LogContext, LogEntry, Logger, LogLevel } from "./Logger";

class StructuredLogger implements Logger {
  constructor(
    private readonly name: string,
    private readonly baseContext: LogContext = {},
  ) {}

  private writeLog(
    level: LogLevel,
    message: string,
    error?: Error | unknown,
    context?: LogContext,
  ): void {
    const mergedContext = {
      ...this.baseContext,
      ...(context ?? {}),
    };

    const hasContext = Object.keys(mergedContext).length > 0;
    const sanitizedContext = hasContext
      ? redactSensitiveData(mergedContext)
      : undefined;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      name: this.name,
      message,
      ...(sanitizedContext ? { context: sanitizedContext } : {}),
    };

    if (error !== undefined) {
      if (error instanceof Error) {
        entry.error = {
          name: error.name,
          message: error.message,
          ...(process.env.NODE_ENV !== "production"
            ? { stack: error.stack }
            : {}),
        };
      } else {
        entry.error = {
          name: "UnknownError",
          message: String(error),
        };
      }
    }

    const output = JSON.stringify(entry);

    switch (level) {
      case "error":
        console.error(output);
        break;
      case "warn":
        console.warn(output);
        break;
      case "info":
      case "debug":
        console.log(output);
        break;
    }
  }

  debug(message: string, context?: LogContext): void {
    this.writeLog("debug", message, undefined, context);
  }

  info(message: string, context?: LogContext): void {
    this.writeLog("info", message, undefined, context);
  }

  warn(message: string, context?: LogContext): void {
    this.writeLog("warn", message, undefined, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    this.writeLog("error", message, error, context);
  }

  child(bindings: LogContext): Logger {
    return new StructuredLogger(this.name, {
      ...this.baseContext,
      ...bindings,
    });
  }
}

export function createLogger(
  name: string,
  defaultContext?: LogContext,
): Logger {
  return new StructuredLogger(name, defaultContext);
}
