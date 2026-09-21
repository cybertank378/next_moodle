export class Result<T = void, E = unknown> {
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;
  private readonly _value?: T;
  private readonly _error?: E;

  private constructor(isSuccess: boolean, error?: E, value?: T) {
    if (isSuccess && error) {
      throw new Error(
        "InvalidOperation: A result cannot be successful and contain an error.",
      );
    }
    if (!isSuccess && error === undefined) {
      throw new Error(
        "InvalidOperation: A failing result must contain an error.",
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this._value = value;
    this._error = error;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error("Cannot retrieve value from a failed result.");
    }
    return this._value as T;
  }

  public getError(): E {
    if (this.isSuccess) {
      throw new Error("Cannot retrieve error from a successful result.");
    }
    return this._error as E;
  }

  public static ok<U = void, F = unknown>(value?: U): Result<U, F> {
    return new Result<U, F>(true, undefined, value);
  }

  public static fail<U = void, F = unknown>(error: F): Result<U, F> {
    return new Result<U, F>(false, error);
  }
}
