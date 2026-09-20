import { Tenant } from "@/modules/tenant/domain/entities/Tenant";
import type { TenantStatus } from "@/modules/tenant/domain/types/TenantStatus";

export interface TenantPersistenceModel {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly status: string;
  readonly moodleBaseUrl: string;
  readonly moodleServiceShortname?: string | null;
  readonly createdAt: string | Date;
  readonly updatedAt: string | Date;
}

// biome-ignore lint/complexity/noStaticOnlyClass: persistence mapper utility
export class TenantPersistenceMapper {
  public static toDomain(model: TenantPersistenceModel): Tenant {
    const rawStatus = (model.status || "ACTIVE").toUpperCase();
    const validStatus: TenantStatus =
      rawStatus === "INACTIVE" || rawStatus === "SUSPENDED"
        ? rawStatus
        : "ACTIVE";

    return new Tenant({
      id: model.id,
      slug: model.slug,
      name: model.name,
      status: validStatus,
      moodleBaseUrl: model.moodleBaseUrl,
      moodleServiceShortname: model.moodleServiceShortname ?? null,
      createdAt: new Date(model.createdAt),
      updatedAt: new Date(model.updatedAt),
    });
  }

  public static toPersistence(entity: Tenant): TenantPersistenceModel {
    return {
      id: entity.id,
      slug: entity.slug,
      name: entity.name,
      status: entity.status,
      moodleBaseUrl: entity.moodleBaseUrl,
      moodleServiceShortname: entity.moodleServiceShortname,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
