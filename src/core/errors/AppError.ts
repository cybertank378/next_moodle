export abstract class AppError extends Error {
  public abstract readonly code: string;
  public abstract readonly statusCode: number;

  constructor(
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
