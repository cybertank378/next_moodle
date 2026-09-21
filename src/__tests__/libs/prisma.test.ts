import { afterEach, describe, expect, it, vi } from "vitest";
import {
  closePrismaConnection,
  disconnectPrisma,
  getPrismaClient,
  getPrismaPool,
  prisma,
  withIsolatedPrisma,
  withPrisma,
} from "@/libs/prisma";
import { prisma as tenantPrisma } from "@/modules/tenant/infrastructure/prismaClient";

describe("libs/prisma singleton & lifecycle", () => {
  afterEach(async () => {
    await closePrismaConnection();
  });

  it("should return the same pool instance on repeated getPrismaPool calls", () => {
    const pool1 = getPrismaPool();
    const pool2 = getPrismaPool();
    expect(pool1).toBe(pool2);
  });

  it("should return the same PrismaClient instance on repeated getPrismaClient calls", () => {
    const client1 = getPrismaClient();
    const client2 = getPrismaClient();
    expect(client1).toBe(client2);
  });

  it("should cleanly close pool and client on closePrismaConnection and re-instantiate on next call", async () => {
    const client1 = getPrismaClient();
    const pool1 = getPrismaPool();

    const poolEndSpy = vi.spyOn(pool1, "end");
    const clientDisconnectSpy = vi.spyOn(client1, "$disconnect");

    await closePrismaConnection();

    expect(poolEndSpy).toHaveBeenCalled();
    expect(clientDisconnectSpy).toHaveBeenCalled();

    // Next call should instantiate fresh instances, avoiding stacked/stale memory
    const client2 = getPrismaClient();
    const pool2 = getPrismaPool();
    expect(client2).not.toBe(client1);
    expect(pool2).not.toBe(pool1);
  });

  it("disconnectPrisma should be an alias of closePrismaConnection", async () => {
    expect(disconnectPrisma).toBe(closePrismaConnection);
  });

  it("withPrisma should execute callback with PrismaClient instance", async () => {
    const result = await withPrisma(async (client) => {
      expect(client).toBeDefined();
      return "operation-success";
    });

    expect(result).toBe("operation-success");
  });

  it("withIsolatedPrisma should execute callback and trigger cleanup", async () => {
    const initialPool = getPrismaPool();
    const poolEndSpy = vi.spyOn(initialPool, "end");

    const result = await withIsolatedPrisma(async (client) => {
      expect(client).toBeDefined();
      return "isolated-success";
    });

    expect(result).toBe("isolated-success");
    expect(poolEndSpy).toHaveBeenCalled();
  });

  it("prisma proxy should dynamically delegate calls to getPrismaClient", () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma.$connect).toBe("function");
    expect(typeof prisma.$disconnect).toBe("function");
  });

  it("tenant prismaClient should delegate to libs/prisma", () => {
    expect(tenantPrisma).toBeDefined();
    expect(typeof tenantPrisma.$connect).toBe("function");
  });
});
