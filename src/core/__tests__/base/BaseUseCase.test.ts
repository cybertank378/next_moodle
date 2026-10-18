import { describe, expect, it } from "vitest";
import { BaseUseCase } from "@/core/base/BaseUseCase";
import { Result } from "@/core/base/Result";

describe("BaseUseCase", () => {
  it("should execute use case logic when handle is called", async () => {
    class TestUseCase extends BaseUseCase<string, string> {
      async handle(input: string): Promise<string> {
        return `handled:${input}`;
      }
    }

    const useCase = new TestUseCase();
    const result = await useCase.handle("test");
    expect(result).toBe("handled:test");
  });

  it("should delegate execute(input) to handle(input)", async () => {
    class AddUseCase extends BaseUseCase<{ a: number; b: number }, Result<number, string>> {
      async handle(input: { a: number; b: number }): Promise<Result<number, string>> {
        if (input.a < 0 || input.b < 0) {
          return Result.fail("Negative numbers not supported");
        }
        return Result.ok(input.a + input.b);
      }
    }

    const useCase = new AddUseCase();
    const successResult = await useCase.execute({ a: 10, b: 20 });
    expect(successResult.isSuccess).toBe(true);
    expect(successResult.getValue()).toBe(30);

    const failResult = await useCase.execute({ a: -5, b: 20 });
    expect(failResult.isFailure).toBe(true);
    expect(failResult.getError()).toBe("Negative numbers not supported");
  });

  it("should preserve thrown domain error context without swallowing", async () => {
    class CustomDomainError extends Error {
      readonly code = "DOMAIN_ERROR";
    }

    class FailingUseCase extends BaseUseCase<void, void> {
      async handle(): Promise<void> {
        throw new CustomDomainError("Business rule violation");
      }
    }

    const useCase = new FailingUseCase();
    await expect(useCase.execute()).rejects.toThrow(CustomDomainError);
  });
});

