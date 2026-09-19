import { AppError, type AppErrorOptions } from "./AppError";

export class ValidationError extends AppError {
  public readonly code: string;
  public readonly statusCode: number = 422;

  constructor(message: string, options?: AppErrorOptions | unknown) {
    super(message, options);
    this.code =
      options &&
      typeof options === "object" &&
      "code" in options &&
      typeof options.code === "string"
        ? options.code
        : "VALIDATION_ERROR";
  }
}
