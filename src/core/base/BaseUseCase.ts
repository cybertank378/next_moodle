/**
 * Canonical BaseUseCase defining the business-process handling contract
 * across all Application Use Cases in the repository.
 *
 * Use cases focus solely on handling business logic ('handle').
 * Execution orchestration, transaction boundaries, and application facades
 * are managed by BaseService / Application Services.
 */
export abstract class BaseUseCase<TInput = void, TOutput = void> {
  /**
   * Core business logic handler for the use case.
   */
  abstract handle(input: TInput): Promise<TOutput>;

  /**
   * Execute delegates to handle(input) to provide uniform compatibility
   * across callers expecting either execute(input) or handle(input).
   */
  execute(input: TInput): Promise<TOutput> {
    return this.handle(input);
  }
}

