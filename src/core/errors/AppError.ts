export abstract class AppError extends Error {
  public abstract readonly code: string;
  public abstract readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(message: string, details?: unknown, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
    this.isOperational = isOperational;

    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
