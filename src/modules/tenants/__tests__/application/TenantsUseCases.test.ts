import { describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { ConfigureTenantCredentialUseCase } from "@/modules/tenants/application/usecases/ConfigureTenantCredentialUseCase";
import { CreateTenantUseCase } from "@/modules/tenants/application/usecases/CreateTenantUseCase";
import { DeleteTenantUseCase } from "@/modules/tenants/application/usecases/DeleteTenantUseCase";
import { GetTenantUseCase } from "@/modules/tenants/application/usecases/GetTenantUseCase";
import { ListTenantsUseCase } from "@/modules/tenants/application/usecases/ListTenantsUseCase";
import { UpdateTenantStatusUseCase } from "@/modules/tenants/application/usecases/UpdateTenantStatusUseCase";
import { UpdateTenantUseCase } from "@/modules/tenants/application/usecases/UpdateTenantUseCase";
import { Tenant } from "@/modules/tenants/domain/entities/Tenant";
import type {
  TenantCredentialCipher,
  TenantCredentialPersistenceInput,
  TenantsRepository,
} from "@/modules/tenants/domain/interfaces/TenantsInterfaces";
import type {
  TenantListFilter,
  TenantStatus,
} from "@/modules/tenants/domain/types/TenantTypes";

const adminActor: AuthorizationActor = {
  id: "admin-1",
  role: AppRole.ADMIN,
  tenantId: null,
};

const tenantActor: AuthorizationActor = {
  id: "tenant-user-1",
  role: AppRole.TENANT,
  tenantId: "tenant-1",
};

function makeTenant(overrides: Partial<ConstructorParameters<typeof Tenant>[0]> = {}) {
  const now = new Date("2026-09-23T04:00:00.000Z");
  return new Tenant({
    id: "tenant-1",
    slug: "acme-school",
    name: "ACME School",
    status: "ACTIVE",
    customDomain: null,
    credential: null,
    branding: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  });
}

class InMemoryTenantsRepository implements TenantsRepository {
  private readonly items = new Map<string, Tenant>();

  constructor(seed: Tenant[] = []) {
    for (const tenant of seed) {
      this.items.set(tenant.id, tenant);
    }
  }

  async findById(id: string): Promise<Tenant | null> {
    return this.items.get(id) ?? null;
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    return [...this.items.values()].find((tenant) => tenant.slug === slug) ?? null;
  }

  async findByCustomDomain(customDomain: string): Promise<Tenant | null> {
    return (
      [...this.items.values()].find(
        (tenant) => tenant.customDomain === customDomain,
      ) ?? null
    );
  }

  async list(filter: TenantListFilter): Promise<Tenant[]> {
    return [...this.items.values()].filter((tenant) => {
      const statusMatches = !filter.status || tenant.status === filter.status;
      const search = filter.search?.toLowerCase();
      const searchMatches =
        !search ||
        tenant.name.toLowerCase().includes(search) ||
        tenant.slug.toLowerCase().includes(search);
      return statusMatches && searchMatches;
    });
  }

  async count(filter: Pick<TenantListFilter, "status" | "search">): Promise<number> {
    return (await this.list({ ...filter, page: 1, pageSize: 100 })).length;
  }

  async create(tenant: Tenant): Promise<Tenant> {
    this.items.set(tenant.id, tenant);
    return tenant;
  }

  async update(tenant: Tenant): Promise<Tenant> {
    this.items.set(tenant.id, tenant);
    return tenant;
  }

  async delete(id: string): Promise<void> {
    this.items.delete(id);
  }

  async upsertCredential(
    input: TenantCredentialPersistenceInput,
  ): Promise<Tenant> {
    const existing = this.items.get(input.tenantId);
    if (!existing) {
      throw new Error("missing tenant");
    }

    const updated = existing.withCredential({
      moodleUrl: input.moodleUrl,
      timeoutBudgetMs: input.timeoutBudgetMs,
      sslVerify: input.sslVerify,
      hasAdminToken: input.encryptedAdminToken.length > 0,
      hasProctorToken: Boolean(input.encryptedProctorToken),
      configuredAt: new Date("2026-09-23T04:05:00.000Z"),
    });
    this.items.set(updated.id, updated);
    return updated;
  }
}

describe("tenants application use cases", () => {
  it("creates a tenant for ADMIN", async () => {
    const repository = new InMemoryTenantsRepository();
    const useCase = new CreateTenantUseCase(repository);

    const result = await useCase.execute({
      actor: adminActor,
      data: {
        slug: "New School",
        name: "New School",
        customDomain: "exam.new-school.sch.id",
      },
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().slug).toBe("new-school");
  });

  it("lists tenants for ADMIN with pagination metadata", async () => {
    const repository = new InMemoryTenantsRepository([makeTenant()]);
    const useCase = new ListTenantsUseCase(repository);

    const result = await useCase.execute({
      actor: adminActor,
      filter: { page: 1, pageSize: 10 },
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().tenants).toHaveLength(1);
    expect(result.getValue().total).toBe(1);
  });

  it("returns tenant detail for ADMIN", async () => {
    const repository = new InMemoryTenantsRepository([makeTenant()]);
    const useCase = new GetTenantUseCase(repository);

    const result = await useCase.execute({
      actor: adminActor,
      tenantId: "tenant-1",
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().id).toBe("tenant-1");
  });

  it("updates tenant metadata for ADMIN", async () => {
    const repository = new InMemoryTenantsRepository([makeTenant()]);
    const useCase = new UpdateTenantUseCase(repository);

    const result = await useCase.execute({
      actor: adminActor,
      tenantId: "tenant-1",
      data: {
        name: "ACME Academy",
        customDomain: "exam.acme.sch.id",
      },
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().name).toBe("ACME Academy");
    expect(result.getValue().customDomain).toBe("exam.acme.sch.id");
  });

  it("updates tenant status for ADMIN", async () => {
    const repository = new InMemoryTenantsRepository([makeTenant()]);
    const useCase = new UpdateTenantStatusUseCase(repository);

    const result = await useCase.execute({
      actor: adminActor,
      tenantId: "tenant-1",
      status: "SUSPENDED",
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().status).toBe("SUSPENDED");
  });

  it("rejects duplicate normalized slug", async () => {
    const repository = new InMemoryTenantsRepository([makeTenant()]);
    const useCase = new CreateTenantUseCase(repository);

    const result = await useCase.execute({
      actor: adminActor,
      data: { slug: "ACME School", name: "Duplicate" },
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError().code).toBe("CONFLICT");
  });

  it("enforces ADMIN-only create authorization", async () => {
    const repository = new InMemoryTenantsRepository();
    const useCase = new CreateTenantUseCase(repository);

    const result = await useCase.execute({
      actor: tenantActor,
      data: { slug: "tenant-created", name: "Should Fail" },
    });

    expect(result.isFailure).toBe(true);
    expect(result.getError().code).toBe("FORBIDDEN");
  });

  it("encrypts credential secrets before persistence and never returns plaintext", async () => {
    const repository = new InMemoryTenantsRepository([makeTenant()]);
    const cipher: TenantCredentialCipher = {
      encrypt: vi.fn(async (plainText, tenantId) => `enc:${tenantId}:${plainText}`),
    };
    const useCase = new ConfigureTenantCredentialUseCase(repository, cipher);

    const result = await useCase.execute({
      actor: adminActor,
      tenantId: "tenant-1",
      data: {
        moodleUrl: "https://moodle.acme.sch.id",
        adminToken: "admin-secret-token",
        proctorToken: "proctor-secret-token",
        timeoutBudgetMs: 10000,
        sslVerify: true,
      },
    });

    expect(result.isSuccess).toBe(true);
    expect(cipher.encrypt).toHaveBeenCalledTimes(2);

    const serialized = JSON.stringify(result.getValue());
    expect(serialized).not.toContain("admin-secret-token");
    expect(serialized).not.toContain("proctor-secret-token");
    expect(serialized).not.toContain("encryptedAdminToken");
    expect(serialized).not.toContain("encryptedProctorToken");
    expect(result.getValue().credential?.hasAdminToken).toBe(true);
    expect(result.getValue().credential?.hasProctorToken).toBe(true);
  });

  it("deletes a tenant for ADMIN", async () => {
    const repository = new InMemoryTenantsRepository([makeTenant()]);
    const useCase = new DeleteTenantUseCase(repository);

    const result = await useCase.execute({
      actor: adminActor,
      tenantId: "tenant-1",
    });

    expect(result.isSuccess).toBe(true);
    await expect(repository.findById("tenant-1")).resolves.toBeNull();
  });
});
