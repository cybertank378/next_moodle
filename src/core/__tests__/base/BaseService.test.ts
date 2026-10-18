import { describe, expect, it } from "vitest";
import { BaseService } from "@/core/base/BaseService";
import { Result } from "@/core/base/Result";

class TestService extends BaseService {
  constructor(name?: string) {
    super(name);
  }

  public getGreeting(name: string): string {
    return `Hello, ${name} from ${this.getServiceName()}`;
  }

  public runOperation(value: number): Promise<Result<number, string>> {
    return this.execute(async () => {
      if (value < 0) {
        return Result.fail("Negative value");
      }
      return Result.ok(value * 2);
    });
  }

  public runThrowingOperation(): Promise<Result<string, Error>> {
    return this.execute(async () => {
      throw new Error("Unexpected crash");
    });
  }
}

describe("BaseService", () => {
  it("should initialize with serviceName and expose it", () => {
    const service = new TestService("TestService");
    expect(service.getServiceName()).toBe("TestService");
  });

  it("should default serviceName to class name when omitted", () => {
    const service = new TestService();
    expect(service.getServiceName()).toBe("TestService");
  });

  it("should execute service business logic correctly", () => {
    const service = new TestService("TestService");
    expect(service.getGreeting("World")).toBe("Hello, World from TestService");
  });

  it("should pass through successful Result from execute", async () => {
    const service = new TestService();
    const result = await service.runOperation(10);
    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toBe(20);
  });

  it("should pass through failed Result from execute", async () => {
    const service = new TestService();
    const result = await service.runOperation(-5);
    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBe("Negative value");
  });

  it("should safely catch unexpected exceptions and return Result.fail", async () => {
    const service = new TestService();
    const result = await service.runThrowingOperation();
    expect(result.isFailure).toBe(true);
    expect(result.getError().message).toBe("Unexpected crash");
  });
});

