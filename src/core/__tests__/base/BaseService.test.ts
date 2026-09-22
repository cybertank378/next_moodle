import { describe, expect, it } from "vitest";
import { BaseService } from "@/core/base/BaseService";

class TestService extends BaseService {
  constructor() {
    super("TestService");
  }

  public getGreeting(name: string): string {
    return `Hello, ${name} from ${this.getServiceName()}`;
  }
}

describe("BaseService", () => {
  it("should initialize with serviceName and expose it", () => {
    const service = new TestService();
    expect(service.getServiceName()).toBe("TestService");
  });

  it("should execute service business logic correctly", () => {
    const service = new TestService();
    expect(service.getGreeting("World")).toBe("Hello, World from TestService");
  });
});
