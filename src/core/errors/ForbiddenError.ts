import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
  public readonly code = "FORBIDDEN";
  public readonly statusCode = 403;

  constructor(message = "Access forbidden", details?: unknown) {
    super(message, details);
  }
}
