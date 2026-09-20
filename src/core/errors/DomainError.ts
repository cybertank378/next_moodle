import { AppError, type AppErrorOptions } from "./AppError";

export class DomainError extends AppError {
  public readonly code: string;
  public readonly statusCode: number = 400;

  constructor(
    message: string,
    code = "DOMAIN_ERROR",
    options?: AppErrorOptions | unknown,
  ) {
    super(message, options);
    this.code = code;
  }
}
