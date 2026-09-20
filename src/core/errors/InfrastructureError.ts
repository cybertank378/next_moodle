import { AppError, type AppErrorOptions } from "./AppError";

export class InfrastructureError extends AppError {
  public readonly code: string;
  public readonly statusCode: number = 502;

  constructor(
    message = "External service communication failure",
    options?: AppErrorOptions | unknown,
  ) {
    super(message, options);
    this.code =
      options &&
      typeof options === "object" &&
      "code" in options &&
      typeof options.code === "string"
        ? options.code
        : "INFRASTRUCTURE_ERROR";
  }
}
