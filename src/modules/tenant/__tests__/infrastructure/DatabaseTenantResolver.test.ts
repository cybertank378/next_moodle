import { describe, expect, it, vi } from "vitest";
import { Tenant } from "@/modules/tenant/domain/Tenant";
import type { TenantRepository } from "@/modules/tenant/domain/TenantRepository";
import { DatabaseTenantResolver } from "@/modules/tenant/infrastructure/DatabaseTenantResolver";

describe("DatabaseTenantResolver", () => {
  const createMockRepo = () => {
    return {
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findByCustomDomain: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    } as unknown as TenantRepository;
  };

  const sampleTenant = new Tenant({
    id: "tenant-uuid-1",
    slug: "school-alpha",
    name: "Alpha School",
    status: "ACTIVE",
    customDomain: "exam.alpha.edu",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  it("should resolve tenant by exact slug", async () => {
    const repo = createMockRepo();
    (repo.findBySlug as ReturnType<typeof vi.fn>).mockResolvedValue(
      sampleTenant,
    );

    const resolver = new DatabaseTenantResolver(repo);
    const context = await resolver.resolveFromIdentifier("school-alpha");

    expect(context).not.toBeNull();
    expect(context?.tenantId).toBe("tenant-uuid-1");
    expect(context?.tenantSlug).toBe("school-alpha");
    expect(context?.status).toBe("ACTIVE");
    expect(context?.customDomain).toBe("exam.alpha.edu");
  });

  it("should resolve tenant by customDomain", async () => {
    const repo = createMockRepo();
    (repo.findBySlug as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (repo.findByCustomDomain as ReturnType<typeof vi.fn>).mockResolvedValue(
      sampleTenant,
    );

    const resolver = new DatabaseTenantResolver(repo);
    const context = await resolver.resolveFromIdentifier("exam.alpha.edu");

    expect(context).not.toBeNull();
    expect(context?.tenantId).toBe("tenant-uuid-1");
    expect(repo.findByCustomDomain).toHaveBeenCalledWith("exam.alpha.edu");
  });

  it("should resolve tenant by subdomain from full host identifier", async () => {
    const repo = createMockRepo();
    // First custom domain check fails
    (repo.findByCustomDomain as ReturnType<typeof vi.fn>).mockResolvedValue(
      null,
    );
    // Exact slug fails for full host
    (repo.findBySlug as ReturnType<typeof vi.fn>).mockImplementation((slug) => {
      if (slug === "school-alpha") return Promise.resolve(sampleTenant);
      return Promise.resolve(null);
    });

    const resolver = new DatabaseTenantResolver(repo);
    const context = await resolver.resolveFromIdentifier(
      "school-alpha.saasplatform.com",
    );

    expect(context).not.toBeNull();
    expect(context?.tenantSlug).toBe("school-alpha");
  });

  it("should return null if tenant is not found", async () => {
    const repo = createMockRepo();
    (repo.findBySlug as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    (repo.findByCustomDomain as ReturnType<typeof vi.fn>).mockResolvedValue(
      null,
    );

    const resolver = new DatabaseTenantResolver(repo);
    const context = await resolver.resolveFromIdentifier("unknown-tenant");

    expect(context).toBeNull();
  });
});
