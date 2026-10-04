import { describe, expect, it, vi } from "vitest";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { AppRole } from "@/core/rbac/AppRole";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { TenantStatus } from "@/libs/enums";
import { GetAdminDashboardUseCase } from "@/modules/dashboard/application/usecases/GetAdminDashboardUseCase";
import type { DashboardRepositoryInterface } from "@/modules/dashboard/domain/interfaces/DashboardRepositoryInterface";

function makeRepo(): DashboardRepositoryInterface {
  return {
    countTenantsByStatus: vi.fn().mockResolvedValue([
      { status: TenantStatus.ACTIVE, count: 3 },
      { status: TenantStatus.MAINTENANCE, count: 1 },
    ]),
    countTenantsCreatedBefore: vi.fn().mockResolvedValue(2),
    findTenantCreatedDatesSince: vi
      .fn()
      .mockResolvedValue([new Date("2026-10-02T00:00:00Z")]),
    findRecentTenants: vi.fn().mockResolvedValue([
      {
        id: "t-1",
        name: "Acme",
        slug: "acme",
        status: TenantStatus.ACTIVE,
        createdAt: new Date("2026-10-02T00:00:00Z"),
      },
    ]),
  };
}

const now = new Date("2026-10-15T00:00:00Z");

describe("GetAdminDashboardUseCase", () => {
  it("menolak actor tanpa sesi", async () => {
    const useCase = new GetAdminDashboardUseCase(makeRepo(), () => now);
    const result = await useCase.execute({ actor: null, months: 6 });

    expect(result.isFailure).toBe(true);
    expect(result.getError()).toBeInstanceOf(UnauthorizedError);
  });

  it.each([AppRole.TENANT, AppRole.STUDENT])(
    "menolak role %s karena tidak memiliki admin.dashboard.read",
    async (role) => {
      const repo = makeRepo();
      const useCase = new GetAdminDashboardUseCase(repo, () => now);
      const result = await useCase.execute({
        actor: { id: "u-1", role, tenantId: "t-1" },
        months: 6,
      });

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBeInstanceOf(AuthorizationError);
      expect(repo.countTenantsByStatus).not.toHaveBeenCalled();
    },
  );

  it("mengembalikan ringkasan platform untuk ADMIN", async () => {
    const useCase = new GetAdminDashboardUseCase(makeRepo(), () => now);
    const result = await useCase.execute({
      actor: { id: "u-admin", role: AppRole.ADMIN, tenantId: null },
      months: 2,
    });

    expect(result.isSuccess).toBe(true);
    const data = result.getValue();
    expect(data.summary).toEqual({
      total: 4,
      active: 3,
      maintenance: 1,
      suspended: 0,
    });
    expect(data.growth).toEqual([
      { period: "2026-09", newTenants: 0, cumulativeTenants: 2 },
      { period: "2026-10", newTenants: 1, cumulativeTenants: 3 },
    ]);
    expect(data.recentTenants[0]).toEqual({
      id: "t-1",
      name: "Acme",
      slug: "acme",
      status: TenantStatus.ACTIVE,
      createdAt: "2026-10-02T00:00:00.000Z",
    });
  });

  it("membatasi jumlah bulan ke rentang yang diizinkan", async () => {
    const repo = makeRepo();
    const useCase = new GetAdminDashboardUseCase(repo, () => now);
    const result = await useCase.execute({
      actor: { id: "u-admin", role: AppRole.ADMIN, tenantId: null },
      months: 999,
    });

    expect(result.getValue().growth).toHaveLength(24);
  });
});
