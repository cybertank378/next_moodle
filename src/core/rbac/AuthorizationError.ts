import { AppError } from "@/core/errors/AppError";

export class AuthorizationError extends AppError {
  public readonly code = "FORBIDDEN";
  public readonly statusCode = 403;

  constructor(
    message = "Anda tidak memiliki akses ke resource ini.",
    details?: unknown,
  ) {
    super(message, details);
  }
}
