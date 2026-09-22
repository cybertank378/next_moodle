import { describe, expect, it } from "vitest";
import { BaseEntity } from "@/core/base/BaseEntity";

class TestUserEntity extends BaseEntity<string> {
  constructor(
    id: string,
    public readonly name: string,
  ) {
    super(id);
  }
}

describe("BaseEntity", () => {
  it("should initialize with given ID and expose it via getter", () => {
    const entity = new TestUserEntity("user-123", "Alice");
    expect(entity.id).toBe("user-123");
    expect(entity.name).toBe("Alice");
  });

  it("should return true when comparing entities with identical IDs", () => {
    const entityA = new TestUserEntity("user-123", "Alice");
    const entityB = new TestUserEntity("user-123", "Alice Modified");
    expect(entityA.equals(entityB)).toBe(true);
  });

  it("should return false when comparing entities with different IDs", () => {
    const entityA = new TestUserEntity("user-123", "Alice");
    const entityB = new TestUserEntity("user-456", "Bob");
    expect(entityA.equals(entityB)).toBe(false);
  });

  it("should return false when comparing with null or undefined", () => {
    const entity = new TestUserEntity("user-123", "Alice");
    expect(entity.equals(null)).toBe(false);
    expect(entity.equals(undefined)).toBe(false);
  });

  it("should return true when comparing entity to itself", () => {
    const entity = new TestUserEntity("user-123", "Alice");
    expect(entity.equals(entity)).toBe(true);
  });

  it("should return false when comparing with non-BaseEntity instance", () => {
    const entity = new TestUserEntity("user-123", "Alice");
    const plainObject = { id: "user-123" } as unknown as BaseEntity<string>;
    expect(entity.equals(plainObject)).toBe(false);
  });
});
