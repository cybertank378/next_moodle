import { AppError } from "./AppError";

export class ConflictError extends AppError {
  public readonly code = "CONFLICT";
  public readonly statusCode = 409;

  constructor(message = "Conflict occurred", details?: unknown) {
    super(message, details);
  }
}
