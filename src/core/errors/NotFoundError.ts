import { AppError, type AppErrorOptions } from "./AppError";

export class NotFoundError extends AppError {
  public readonly code: string;
  public readonly statusCode: number = 404;

  constructor(
    message = "Resource not found",
    options?: AppErrorOptions | unknown,
  ) {
    super(message, options);
    this.code =
      options &&
      typeof options === "object" &&
      "code" in options &&
      typeof options.code === "string"
        ? options.code
        : "NOT_FOUND";
  }
}
