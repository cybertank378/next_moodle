import { AppError } from "./AppError";

export class InfrastructureError extends AppError {
  public readonly code: string = "INFRASTRUCTURE_ERROR";
  public readonly statusCode: number = 502;

  constructor(message = "External service communication failure", details?: unknown) {
    super(message, details);
  }
}
