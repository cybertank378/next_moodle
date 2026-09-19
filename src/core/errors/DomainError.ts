import { AppError } from "./AppError";

export class DomainError extends AppError {
  public readonly code: string;
  public readonly statusCode: number = 400;

  constructor(message: string, code = "DOMAIN_ERROR", details?: unknown) {
    super(message, details);
    this.code = code;
  }
}
