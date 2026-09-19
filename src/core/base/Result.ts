export class Result<T, E extends Error = Error> {
  private readonly _isSuccess: boolean;
  private readonly _value?: T;
  private readonly _error?: E;

  private constructor(isSuccess: boolean, value?: T, error?: E) {
    this._isSuccess = isSuccess;
    this._value = value;
    this._error = error;
    Object.freeze(this);
  }

  public get isSuccess(): boolean {
    return this._isSuccess;
  }

  public get isFailure(): boolean {
    return !this._isSuccess;
  }

  public get value(): T {
    if (!this._isSuccess) {
      throw new Error("Cannot get value from a failed Result.");
    }
    return this._value as T;
  }

  public get error(): E {
    if (this._isSuccess) {
      throw new Error("Cannot get error from a successful Result.");
    }
    return this._error as E;
  }

  public getValue(): T {
    return this.value;
  }

  public getError(): E {
    return this.error;
  }

  public static ok<T>(value: T): Result<T, never> {
    return new Result<T, never>(true, value);
  }

  public static fail<E extends Error>(error: E): Result<never, E> {
    return new Result<never, E>(false, undefined, error);
  }
}
