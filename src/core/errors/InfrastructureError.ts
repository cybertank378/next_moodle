import { AppError } from "./AppError";

export class InfrastructureError extends AppError {
  public readonly code = "INFRASTRUCTURE_ERROR";
  public readonly statusCode = 500;

  constructor(message = "Infrastructure failure", details?: unknown) {
    super(message, details);
  }
}
