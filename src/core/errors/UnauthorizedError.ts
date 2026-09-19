import { AppError, type AppErrorOptions } from "./AppError";

export class UnauthorizedError extends AppError {
  public readonly code: string;
  public readonly statusCode: number = 401;

  constructor(
    message = "Unauthorized access",
    options?: AppErrorOptions | unknown,
  ) {
    super(message, options);
    this.code =
      options &&
      typeof options === "object" &&
      "code" in options &&
      typeof options.code === "string"
        ? options.code
        : "UNAUTHORIZED";
  }
}
