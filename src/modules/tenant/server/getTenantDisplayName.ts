import "server-only";

import { prisma } from "@/libs/prisma";
import { TenantRepository } from "@/modules/tenant/infrastructure/repo/TenantRepository";

export async function getTenantDisplayName(
  tenantId: string,
): Promise<string | undefined> {
  const tenant = await new TenantRepository(prisma).findById(tenantId);
  return tenant?.name;
}
