import type { LogContext } from "./LogContext";
import { JsonLogger, type Logger } from "./Logger";

export function createLogger(defaultContext: LogContext = {}): Logger {
  return new JsonLogger(defaultContext);
}
