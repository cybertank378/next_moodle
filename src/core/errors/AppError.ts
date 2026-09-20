export interface AppErrorOptions {
  readonly code?: string;
  readonly statusCode?: number;
  readonly details?: unknown;
  readonly cause?: unknown;
}

export abstract class AppError extends Error {
  public abstract readonly code: string;
  public abstract readonly statusCode: number;
  public readonly details?: unknown;
  public override readonly cause?: unknown;

  constructor(message: string, options?: AppErrorOptions | unknown) {
    // Check if options is AppErrorOptions
    const isOptionsObject =
      options !== null &&
      typeof options === "object" &&
      ("details" in (options as object) ||
        "cause" in (options as object) ||
        "code" in (options as object));

    const opts: AppErrorOptions = isOptionsObject
      ? (options as AppErrorOptions)
      : { details: options };

    super(message, { cause: opts.cause });
    this.name = this.constructor.name;
    this.details = opts.details;
    this.cause = opts.cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
