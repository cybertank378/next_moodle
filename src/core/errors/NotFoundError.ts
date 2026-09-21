import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  public readonly code = "NOT_FOUND";
  public readonly statusCode = 404;

  constructor(message = "Resource not found", details?: unknown) {
    super(message, details);
  }
}
