import { randomUUID } from "node:crypto";
import { Tenant } from "@/modules/tenant/domain/entity/TenantEntity";
import { TenantNormalizer } from "@/modules/tenant/domain/normalizers/TenantNormalizer";
import { TenantValidator } from "@/modules/tenant/domain/validators/TenantValidator";

export const TenantBuilder = {
  create(input: {
    slug: string;
    name: string;
    customDomain?: string | null;
  }): Tenant {
    const slug = TenantNormalizer.slug(input.slug);
    const name = TenantNormalizer.name(input.name);
    const customDomain = TenantNormalizer.customDomain(input.customDomain);

    TenantValidator.slug(slug);
    TenantValidator.name(name);

    const now = new Date();
    return new Tenant({
      id: randomUUID(),
      slug,
      name,
      status: "ACTIVE",
      customDomain,
      credential: null,
      branding: null,
      createdAt: now,
      updatedAt: now,
    });
  },
} as const;
