import { randomUUID } from "node:crypto";
import { Tenant } from "@/modules/tenant/domain/entity/TenantEntity";
import { TenantNormalizer } from "@/modules/tenant/domain/normalizers/TenantNormalizer";
import type { TenantStatus } from "@/modules/tenant/domain/types/TenantMetadata";
import { TenantValidator } from "@/modules/tenant/domain/validators/TenantValidator";

export const TenantBuilder = {
  create(input: {
    slug: string;
    name: string;
    status?: TenantStatus | string;
    customDomain?: string | null;
  }): Tenant {
    const slug = TenantNormalizer.slug(input.slug);
    const name = TenantNormalizer.name(input.name);
    const customDomain = TenantNormalizer.customDomain(input.customDomain);

    TenantValidator.slug(slug);
    TenantValidator.name(name);
    if (input.status) {
      TenantValidator.status(input.status);
    }

    const status: TenantStatus =
      input.status &&
      (["ACTIVE", "MAINTENANCE", "SUSPENDED"] as const).includes(
        input.status as TenantStatus,
      )
        ? (input.status as TenantStatus)
        : "ACTIVE";

    const now = new Date();
    return new Tenant({
      id: randomUUID(),
      slug,
      name,
      status,
      customDomain,
      credential: null,
      branding: null,
      createdAt: now,
      updatedAt: now,
    });
  },
} as const;
