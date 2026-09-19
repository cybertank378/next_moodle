import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
  public readonly code: string = "UNAUTHORIZED";
  public readonly statusCode: number = 401;

  constructor(message = "Unauthorized access", details?: unknown) {
    super(message, details);
  }
}
