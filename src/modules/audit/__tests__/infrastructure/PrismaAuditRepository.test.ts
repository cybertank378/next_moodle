import { describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  findFirst: vi.fn(),
  findMany: vi.fn(),
  count: vi.fn(),
}));
vi.mock("@/libs/prisma", () => ({ prisma: { saasAuditLog: db } }));

import { PrismaAuditRepository } from "@/modules/audit/infrastructure/repo/PrismaAuditRepository";

describe("Prisma audit WHERE tenant isolation", () => {
  it("detail constrains tenant ID in DB WHERE", async () => {
    db.findFirst.mockResolvedValue(null);
    const result = await new PrismaAuditRepository().findById("log-tenant-b", {
      role: "TENANT",
      tenantId: "tenant-a",
    });
    expect(result).toBeNull();
    expect(db.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "log-tenant-b", tenantId: "tenant-a" },
      }),
    );
  });
  it("list and every statistic count scoped to tenant", async () => {
    db.findMany.mockResolvedValue([]);
    db.count.mockResolvedValue(0);
    await new PrismaAuditRepository().list(
      { page: 1, pageSize: 10, sortOrder: "desc" },
      { role: "TENANT", tenantId: "tenant-a" },
    );
    expect(db.findMany.mock.calls[0][0].where.tenantId).toBe("tenant-a");
    for (const [arg] of db.count.mock.calls) {
      expect(JSON.stringify(arg.where)).toContain('"tenantId":"tenant-a"');
    }
  });
});
