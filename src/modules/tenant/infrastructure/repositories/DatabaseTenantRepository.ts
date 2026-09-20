import { ConflictError } from "@/core/errors/ConflictError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { Tenant } from "@/modules/tenant/domain/entities/Tenant";
import type { TenantRepository } from "@/modules/tenant/domain/interfaces/TenantRepository";
import {
  TenantPersistenceMapper,
  type TenantPersistenceModel,
} from "@/modules/tenant/infrastructure/mappers/TenantPersistenceMapper";

export class DatabaseTenantRepository implements TenantRepository {
  private readonly recordsById = new Map<string, TenantPersistenceModel>();
  private readonly idBySlug = new Map<string, string>();

  constructor() {
    // Seed default demo tenant
    const demoEntity = new Tenant({
      id: "tenant_demo",
      slug: "demo",
      name: "Demo Institution",
      status: "ACTIVE",
      moodleBaseUrl:
        process.env.DEFAULT_MOODLE_URL || "https://moodle.example.com",
      moodleServiceShortname: "exam_service",
      createdAt: new Date(),
    });

    const persistence = TenantPersistenceMapper.toPersistence(demoEntity);
    this.recordsById.set(persistence.id, persistence);
    this.idBySlug.set(persistence.slug, persistence.id);
  }

  public async findById(tenantId: string): Promise<Tenant | null> {
    const record = this.recordsById.get(tenantId);
    if (!record) {
      return null;
    }
    return TenantPersistenceMapper.toDomain(record);
  }

  public async findBySlug(slug: string): Promise<Tenant | null> {
    const canonicalSlug = slug.trim().toLowerCase();
    const id = this.idBySlug.get(canonicalSlug);
    if (!id) {
      return null;
    }
    return this.findById(id);
  }

  public async existsBySlug(slug: string): Promise<boolean> {
    const canonicalSlug = slug.trim().toLowerCase();
    return this.idBySlug.has(canonicalSlug);
  }

  public async create(tenant: Tenant): Promise<Tenant> {
    const canonicalSlug = tenant.slug.trim().toLowerCase();
    if (this.idBySlug.has(canonicalSlug)) {
      throw new ConflictError(
        `Tenant dengan slug '${tenant.slug}' sudah ada.`,
        {
          code: "TENANT_SLUG_EXISTS",
        },
      );
    }

    const persistence = TenantPersistenceMapper.toPersistence(tenant);
    this.recordsById.set(persistence.id, persistence);
    this.idBySlug.set(canonicalSlug, persistence.id);

    return tenant;
  }

  public async update(tenant: Tenant): Promise<Tenant> {
    const existing = this.recordsById.get(tenant.id);
    if (!existing) {
      throw new NotFoundError(`Tenant '${tenant.id}' tidak ditemukan.`, {
        code: "TENANT_NOT_FOUND",
      });
    }

    const newSlug = tenant.slug.trim().toLowerCase();
    const oldSlug = existing.slug.trim().toLowerCase();

    if (newSlug !== oldSlug && this.idBySlug.has(newSlug)) {
      throw new ConflictError(
        `Tenant dengan slug '${tenant.slug}' sudah ada.`,
        {
          code: "TENANT_SLUG_EXISTS",
        },
      );
    }

    this.idBySlug.delete(oldSlug);

    const persistence = TenantPersistenceMapper.toPersistence(tenant);
    this.recordsById.set(persistence.id, persistence);
    this.idBySlug.set(newSlug, persistence.id);

    return tenant;
  }
}
