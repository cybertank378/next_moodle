import { AppError } from "./AppError";

export class ValidationError extends AppError {
  public readonly code: string = "VALIDATION_ERROR";
  public readonly statusCode: number = 422;
}
