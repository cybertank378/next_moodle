import { AppError } from "./AppError";

export class SecurityError extends AppError {
  public readonly code = "SECURITY_VIOLATION";
  public readonly statusCode = 403;

  constructor(message = "Security violation detected", details?: unknown) {
    super(message, details);
  }
}
