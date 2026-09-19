import { Tenant } from "../../domain/entities/Tenant";
import type { TenantRepository } from "../../domain/interfaces/TenantRepository";

export class InMemoryTenantRepository implements TenantRepository {
  private readonly tenants = new Map<string, Tenant>();

  constructor() {
    // Seed with demo tenant
    const demo = new Tenant({
      id: "tenant_demo",
      slug: "demo",
      name: "Demo Institution",
      moodleUrl: process.env.DEFAULT_MOODLE_URL || "https://moodle.example.com",
      moodleToken: process.env.DEFAULT_MOODLE_TOKEN || "mock_token",
      status: "active",
      createdAt: new Date(),
    });
    this.tenants.set(demo.id, demo);
    this.tenants.set(demo.slug, demo);
  }

  public async findById(id: string): Promise<Tenant | null> {
    return this.tenants.get(id) ?? null;
  }

  public async findBySlug(slug: string): Promise<Tenant | null> {
    return this.tenants.get(slug) ?? null;
  }

  public async save(tenant: Tenant): Promise<void> {
    this.tenants.set(tenant.id, tenant);
    this.tenants.set(tenant.slug, tenant);
  }
}
