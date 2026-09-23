import "server-only";

import type { PrismaClient } from "@prisma/client";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import type {
  LoginTenant,
  TenantAuthResolver,
} from "@/modules/auth/domain/interfaces/AuthInterfaces";

export class PrismaTenantAuthResolver implements TenantAuthResolver {
  constructor(private readonly prisma: PrismaClient) {}

  async resolveLoginTenant(identifier: string): Promise<LoginTenant> {
    const normalized = identifier.trim().toLowerCase();
    const tenant = await this.prisma.tenant.findFirst({
      where: {
        OR: [{ slug: normalized }, { customDomain: normalized }],
      },
      include: { credential: true },
    });

    if (!tenant) throw new NotFoundError("Tenant tidak ditemukan.");
    if (tenant.status !== "ACTIVE") {
      throw new ForbiddenError("Tenant tidak aktif.");
    }
    if (!tenant.credential) {
      throw new NotFoundError("Konfigurasi Moodle tenant belum tersedia.");
    }

    return {
      tenantId: tenant.id,
      slug: tenant.slug,
      status: tenant.status,
      moodleUrl: tenant.credential.moodleUrl,
    };
  }
}
