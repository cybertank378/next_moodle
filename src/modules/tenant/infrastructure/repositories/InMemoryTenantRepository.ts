import type { Tenant } from "@/modules/tenant/domain/entities/Tenant";
import type { TenantRepository } from "@/modules/tenant/domain/interfaces/TenantRepository";
import { DatabaseTenantRepository } from "./DatabaseTenantRepository";

export class InMemoryTenantRepository implements TenantRepository {
  private readonly delegate = new DatabaseTenantRepository();

  public async findById(id: string): Promise<Tenant | null> {
    return this.delegate.findById(id);
  }

  public async findBySlug(slug: string): Promise<Tenant | null> {
    return this.delegate.findBySlug(slug);
  }

  public async existsBySlug(slug: string): Promise<boolean> {
    return this.delegate.existsBySlug(slug);
  }

  public async create(tenant: Tenant): Promise<Tenant> {
    return this.delegate.create(tenant);
  }

  public async update(tenant: Tenant): Promise<Tenant> {
    return this.delegate.update(tenant);
  }

  public async save(tenant: Tenant): Promise<void> {
    const exists = await this.delegate.findById(tenant.id);
    if (exists) {
      await this.delegate.update(tenant);
    } else {
      await this.delegate.create(tenant);
    }
  }
}
