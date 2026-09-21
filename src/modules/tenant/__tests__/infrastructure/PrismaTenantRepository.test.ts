import type { PrismaClient } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import { Tenant } from "@/modules/tenant/domain/Tenant";
import { PrismaTenantRepository } from "@/modules/tenant/infrastructure/PrismaTenantRepository";

describe("PrismaTenantRepository", () => {
  const mockPrismaTenant = {
    id: "tenant-uuid-123",
    slug: "acme",
    name: "ACME School",
    status: "ACTIVE" as const,
    customDomain: "lms.acme.edu",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-02"),
    credential: {
      id: "cred-uuid-1",
      tenantId: "tenant-uuid-123",
      moodleUrl: "https://moodle.acme.edu",
      encryptedAdminToken: "cipher_admin_token",
      encryptedProctorToken: null,
      timeoutBudgetMs: 10000,
      sslVerify: true,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-02"),
    },
    branding: {
      id: "brand-uuid-1",
      tenantId: "tenant-uuid-123",
      logoUrl: "https://acme.edu/logo.png",
      primaryColor: "#003366",
      accentColor: "#ff9900",
      faviconUrl: null,
      customCss: null,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-02"),
    },
  };

  const createMockPrisma = () => {
    return {
      tenant: {
        findUnique: vi.fn(),
        upsert: vi.fn(),
        delete: vi.fn(),
      },
    } as unknown as PrismaClient;
  };

  it("should find tenant by id and map to domain entity", async () => {
    const mockPrisma = createMockPrisma();
    (
      mockPrisma.tenant.findUnique as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockPrismaTenant);

    const repository = new PrismaTenantRepository(mockPrisma);
    const tenant = await repository.findById("tenant-uuid-123");

    expect(tenant).toBeInstanceOf(Tenant);
    expect(tenant?.id).toBe("tenant-uuid-123");
    expect(tenant?.slug).toBe("acme");
    expect(tenant?.name).toBe("ACME School");
    expect(tenant?.credential?.moodleUrl).toBe("https://moodle.acme.edu");
    expect(tenant?.branding?.primaryColor).toBe("#003366");
  });

  it("should return null if tenant by id is not found", async () => {
    const mockPrisma = createMockPrisma();
    (
      mockPrisma.tenant.findUnique as ReturnType<typeof vi.fn>
    ).mockResolvedValue(null);

    const repository = new PrismaTenantRepository(mockPrisma);
    const tenant = await repository.findById("non-existent");

    expect(tenant).toBeNull();
  });

  it("should find tenant by slug and map to domain entity", async () => {
    const mockPrisma = createMockPrisma();
    (
      mockPrisma.tenant.findUnique as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockPrismaTenant);

    const repository = new PrismaTenantRepository(mockPrisma);
    const tenant = await repository.findBySlug("acme");

    expect(tenant).toBeInstanceOf(Tenant);
    expect(tenant?.slug).toBe("acme");
    expect(mockPrisma.tenant.findUnique).toHaveBeenCalledWith({
      where: { slug: "acme" },
      include: { credential: true, branding: true },
    });
  });

  it("should find tenant by customDomain and map to domain entity", async () => {
    const mockPrisma = createMockPrisma();
    (
      mockPrisma.tenant.findUnique as ReturnType<typeof vi.fn>
    ).mockResolvedValue(mockPrismaTenant);

    const repository = new PrismaTenantRepository(mockPrisma);
    const tenant = await repository.findByCustomDomain("lms.acme.edu");

    expect(tenant).toBeInstanceOf(Tenant);
    expect(tenant?.customDomain).toBe("lms.acme.edu");
    expect(mockPrisma.tenant.findUnique).toHaveBeenCalledWith({
      where: { customDomain: "lms.acme.edu" },
      include: { credential: true, branding: true },
    });
  });

  it("should save tenant with relations using upsert", async () => {
    const mockPrisma = createMockPrisma();
    (mockPrisma.tenant.upsert as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockPrismaTenant,
    );

    const domainTenant = new Tenant({
      id: "tenant-uuid-123",
      slug: "acme",
      name: "ACME School",
      status: "ACTIVE",
      credential: {
        id: "cred-uuid-1",
        tenantId: "tenant-uuid-123",
        moodleUrl: "https://moodle.acme.edu",
        encryptedAdminToken: "cipher_admin_token",
        timeoutBudgetMs: 10000,
        sslVerify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repository = new PrismaTenantRepository(mockPrisma);
    const saved = await repository.save(domainTenant);

    expect(saved).toBeInstanceOf(Tenant);
    expect(mockPrisma.tenant.upsert).toHaveBeenCalledOnce();
  });

  it("should delete tenant by id", async () => {
    const mockPrisma = createMockPrisma();
    (mockPrisma.tenant.delete as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockPrismaTenant,
    );

    const repository = new PrismaTenantRepository(mockPrisma);
    await repository.delete("tenant-uuid-123");

    expect(mockPrisma.tenant.delete).toHaveBeenCalledWith({
      where: { id: "tenant-uuid-123" },
    });
  });
});
