import { AppError, type AppErrorOptions } from "./AppError";

export class ConflictError extends AppError {
  public readonly code: string;
  public readonly statusCode: number = 409;

  constructor(
    message = "Conflict detected",
    options?: AppErrorOptions | unknown,
  ) {
    super(message, options);
    this.code =
      options &&
      typeof options === "object" &&
      "code" in options &&
      typeof options.code === "string"
        ? options.code
        : "CONFLICT";
  }
}
