import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
  public readonly code: string = "FORBIDDEN";
  public readonly statusCode: number = 403;

  constructor(message = "Access forbidden", details?: unknown) {
    super(message, details);
  }
}
