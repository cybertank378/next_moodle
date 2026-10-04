import { AppError } from "@/core/errors/AppError";

export class DomainError extends AppError {
  public readonly code = "DOMAIN_ERROR";
  public readonly statusCode = 400;

  constructor(message: string, details?: unknown) {
    super(message, details);
  }
}
