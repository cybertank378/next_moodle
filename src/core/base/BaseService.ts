import { Result } from "@/core/base/Result";

export abstract class BaseService {
  protected readonly serviceName: string;

  constructor(serviceName?: string) {
    this.serviceName = serviceName ?? this.constructor.name;
  }

  public getServiceName(): string {
    return this.serviceName;
  }

  /**
   * Application execution boundary.
   * Coordinates use case execution, transactions, and error normalization.
   */
  protected async execute<T, E = Error>(
    operation: () => Promise<Result<T, E>> | Promise<T>,
  ): Promise<Result<T, E>> {
    try {
      const result = await operation();
      if (
        result instanceof Result ||
        (result && typeof (result as { isSuccess?: unknown }).isSuccess === "boolean")
      ) {
        return result as Result<T, E>;
      }
      return Result.ok<T, E>(result as T);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Result.fail<T, E>(error as unknown as E);
      }
      return Result.fail<T, E>(new Error(String(error)) as unknown as E);
    }
  }
}

