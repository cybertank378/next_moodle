import { type ILogger, JsonLogger, type LogContext } from "./Logger";

export function createLogger(defaultContext: LogContext = {}): ILogger {
  return new JsonLogger(defaultContext);
}
