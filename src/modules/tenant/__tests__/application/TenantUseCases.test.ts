import { describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { CreateTenantUseCase } from "@/modules/tenant/application/usecases/CreateTenantUseCase";
import { GetTenantsUseCase } from "@/modules/tenant/application/usecases/GetTenantsUseCase";
import { GetTenantUseCase } from "@/modules/tenant/application/usecases/GetTenantUseCase";
import { UpdateTenantStatusUseCase } from "@/modules/tenant/application/usecases/UpdateTenantStatusUseCase";
import { UpdateTenantUseCase } from "@/modules/tenant/application/usecases/UpdateTenantUseCase";
import { Tenant } from "@/modules/tenant/domain/Tenant";
import type { TenantRepository } from "@/modules/tenant/domain/TenantRepository";

// ─── Mock Repository ──────────────────────────────────────────────────────────

function makeMockRepo(
  overrides: Partial<TenantRepository> = {},
): TenantRepository {
  return {
    findById: vi.fn().mockResolvedValue(null),
    findBySlug: vi.fn().mockResolvedValue(null),
    findByCustomDomain: vi.fn().mockResolvedValue(null),
    findAll: vi.fn().mockResolvedValue([]),
    count: vi.fn().mockResolvedValue(0),
    save: vi.fn().mockImplementation(async (t: Tenant) => t),
    delete: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function makeAdminActor(): AuthorizationActor {
  return { id: "admin-1", role: AppRole.ADMIN, tenantId: null };
}

function makeTenantActor(tenantId = "tenant-123"): AuthorizationActor {
  return { id: "tenant-op-1", role: AppRole.TENANT, tenantId };
}

function makeStudentActor(): AuthorizationActor {
  return { id: "student-1", role: AppRole.STUDENT, tenantId: "tenant-123" };
}

const now = new Date("2026-01-01T00:00:00Z");

function makeTenantEntity(overrides = {}): Tenant {
  return new Tenant({
    id: "tenant-123",
    slug: "acme-corp",
    name: "ACME Corporation",
    status: "ACTIVE",
    customDomain: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  });
}

// ─── GetTenantsUseCase ────────────────────────────────────────────────────────

describe("GetTenantsUseCase", () => {
  it("should allow ADMIN to list tenants", async () => {
    const repo = makeMockRepo({
      findAll: vi.fn().mockResolvedValue([makeTenantEntity()]),
      count: vi.fn().mockResolvedValue(1),
    });
    const useCase = new GetTenantsUseCase(repo);
    const result = await useCase.execute({ actor: makeAdminActor() });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().tenants).toHaveLength(1);
    expect(result.getValue().total).toBe(1);
  });

  it("should reject TENANT role from listing all tenants", async () => {
    const repo = makeMockRepo();
    const useCase = new GetTenantsUseCase(repo);
    const result = await useCase.execute({ actor: makeTenantActor() });

    expect(result.isFailure).toBe(true);
  });

  it("should reject STUDENT role from listing tenants", async () => {
    const repo = makeMockRepo();
    const useCase = new GetTenantsUseCase(repo);
    const result = await useCase.execute({ actor: makeStudentActor() });

    expect(result.isFailure).toBe(true);
  });

  it("should pass filter params to repository", async () => {
    const findAllMock = vi.fn().mockResolvedValue([]);
    const countMock = vi.fn().mockResolvedValue(0);
    const repo = makeMockRepo({ findAll: findAllMock, count: countMock });
    const useCase = new GetTenantsUseCase(repo);

    await useCase.execute({
      actor: makeAdminActor(),
      filter: { status: "SUSPENDED", page: 2, pageSize: 10 },
    });

    expect(findAllMock).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: expect.objectContaining({ status: "SUSPENDED" }),
      }),
    );
  });
});

// ─── GetTenantUseCase ─────────────────────────────────────────────────────────

describe("GetTenantUseCase", () => {
  it("should allow ADMIN to get any tenant by id", async () => {
    const tenant = makeTenantEntity();
    const repo = makeMockRepo({ findById: vi.fn().mockResolvedValue(tenant) });
    const useCase = new GetTenantUseCase(repo);
    const result = await useCase.execute({
      actor: makeAdminActor(),
      tenantId: "tenant-123",
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().id).toBe("tenant-123");
  });

  it("should return failure when tenant not found", async () => {
    const repo = makeMockRepo({ findById: vi.fn().mockResolvedValue(null) });
    const useCase = new GetTenantUseCase(repo);
    const result = await useCase.execute({
      actor: makeAdminActor(),
      tenantId: "does-not-exist",
    });

    expect(result.isFailure).toBe(true);
  });

  it("should reject TENANT role from getting tenant", async () => {
    const repo = makeMockRepo({
      findById: vi.fn().mockResolvedValue(makeTenantEntity()),
    });
    const useCase = new GetTenantUseCase(repo);
    const result = await useCase.execute({
      actor: makeTenantActor(),
      tenantId: "tenant-123",
    });

    expect(result.isFailure).toBe(true);
  });
});

// ─── CreateTenantUseCase ──────────────────────────────────────────────────────

describe("CreateTenantUseCase", () => {
  it("should allow ADMIN to create a tenant", async () => {
    const savedTenant = makeTenantEntity();
    const repo = makeMockRepo({ save: vi.fn().mockResolvedValue(savedTenant) });
    const useCase = new CreateTenantUseCase(repo);

    const result = await useCase.execute({
      actor: makeAdminActor(),
      data: { slug: "acme-corp", name: "ACME Corporation" },
    });

    expect(result.isSuccess).toBe(true);
  });

  it("should reject TENANT role from creating a tenant", async () => {
    const repo = makeMockRepo();
    const useCase = new CreateTenantUseCase(repo);

    const result = await useCase.execute({
      actor: makeTenantActor(),
      data: { slug: "acme-corp", name: "ACME Corporation" },
    });

    expect(result.isFailure).toBe(true);
  });

  it("should reject an invalid slug", async () => {
    const repo = makeMockRepo();
    const useCase = new CreateTenantUseCase(repo);

    const result = await useCase.execute({
      actor: makeAdminActor(),
      data: { slug: "--invalid--", name: "Test" },
    });

    expect(result.isFailure).toBe(true);
  });

  it("should reject duplicate slug", async () => {
    const existing = makeTenantEntity();
    const repo = makeMockRepo({
      findBySlug: vi.fn().mockResolvedValue(existing),
    });
    const useCase = new CreateTenantUseCase(repo);

    const result = await useCase.execute({
      actor: makeAdminActor(),
      data: { slug: "acme-corp", name: "Another Corp" },
    });

    expect(result.isFailure).toBe(true);
  });

  it("should reject duplicate custom domain", async () => {
    const existing = makeTenantEntity({ customDomain: "lms.acme.edu" });
    const repo = makeMockRepo({
      findByCustomDomain: vi.fn().mockResolvedValue(existing),
    });
    const useCase = new CreateTenantUseCase(repo);

    const result = await useCase.execute({
      actor: makeAdminActor(),
      data: {
        slug: "beta-corp",
        name: "Beta Corp",
        customDomain: "lms.acme.edu",
      },
    });

    expect(result.isFailure).toBe(true);
  });
});

// ─── UpdateTenantUseCase ──────────────────────────────────────────────────────

describe("UpdateTenantUseCase", () => {
  it("should allow ADMIN to update tenant name", async () => {
    const existing = makeTenantEntity();
    const repo = makeMockRepo({
      findById: vi.fn().mockResolvedValue(existing),
      save: vi.fn().mockResolvedValue(existing),
    });
    const useCase = new UpdateTenantUseCase(repo);

    const result = await useCase.execute({
      actor: makeAdminActor(),
      tenantId: "tenant-123",
      data: { name: "ACME University" },
    });

    expect(result.isSuccess).toBe(true);
  });

  it("should reject TENANT role from updating tenant", async () => {
    const repo = makeMockRepo({
      findById: vi.fn().mockResolvedValue(makeTenantEntity()),
    });
    const useCase = new UpdateTenantUseCase(repo);

    const result = await useCase.execute({
      actor: makeTenantActor(),
      tenantId: "tenant-123",
      data: { name: "Hacked Name" },
    });

    expect(result.isFailure).toBe(true);
  });

  it("should return failure when tenant not found", async () => {
    const repo = makeMockRepo({ findById: vi.fn().mockResolvedValue(null) });
    const useCase = new UpdateTenantUseCase(repo);

    const result = await useCase.execute({
      actor: makeAdminActor(),
      tenantId: "ghost-tenant",
      data: { name: "Ghost" },
    });

    expect(result.isFailure).toBe(true);
  });
});

// ─── UpdateTenantStatusUseCase ────────────────────────────────────────────────

describe("UpdateTenantStatusUseCase", () => {
  it("should allow ADMIN to suspend a tenant", async () => {
    const existing = makeTenantEntity();
    const suspended = makeTenantEntity({ status: "SUSPENDED" });
    const repo = makeMockRepo({
      findById: vi.fn().mockResolvedValue(existing),
      save: vi.fn().mockResolvedValue(suspended),
    });
    const useCase = new UpdateTenantStatusUseCase(repo);

    const result = await useCase.execute({
      actor: makeAdminActor(),
      tenantId: "tenant-123",
      status: "SUSPENDED",
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().status).toBe("SUSPENDED");
  });

  it("should reject TENANT role from updating status", async () => {
    const repo = makeMockRepo({
      findById: vi.fn().mockResolvedValue(makeTenantEntity()),
    });
    const useCase = new UpdateTenantStatusUseCase(repo);

    const result = await useCase.execute({
      actor: makeTenantActor(),
      tenantId: "tenant-123",
      status: "SUSPENDED",
    });

    expect(result.isFailure).toBe(true);
  });

  it("should confirm suspended status is explicitly tracked", async () => {
    const suspended = makeTenantEntity({ status: "SUSPENDED" });
    const repo = makeMockRepo({
      findById: vi.fn().mockResolvedValue(suspended),
      save: vi.fn().mockResolvedValue(suspended),
    });
    const useCase = new UpdateTenantStatusUseCase(repo);

    const result = await useCase.execute({
      actor: makeAdminActor(),
      tenantId: "tenant-123",
      status: "ACTIVE",
    });

    expect(result.isSuccess).toBe(true);
  });
});
