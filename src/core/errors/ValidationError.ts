import { AppError } from "./AppError";

export class ValidationError extends AppError {
  public readonly code = "VALIDATION_ERROR";
  public readonly statusCode = 400;

  constructor(message = "Validation failed", details?: unknown) {
    super(message, details);
  }
}
