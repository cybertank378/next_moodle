import { AppError } from "@/core/errors/AppError";

export class UnauthorizedError extends AppError {
  public readonly code = "UNAUTHORIZED";
  public readonly statusCode = 401;

  constructor(message = "Unauthorized access", details?: unknown) {
    super(message, details);
  }
}
