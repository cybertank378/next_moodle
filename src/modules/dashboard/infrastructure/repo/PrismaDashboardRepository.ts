import "server-only";

import type { PrismaClient } from "@prisma/client";
import { TenantStatus } from "@/libs/enums";
import { prisma } from "@/libs/prisma";
import type { DashboardRepositoryInterface } from "../../domain/interfaces/DashboardRepositoryInterface";
import type {
  RecentTenantRecord,
  TenantStatusCount,
} from "../../domain/types/DashboardTypes";

const KNOWN_STATUSES = new Set<string>(Object.values(TenantStatus));

function toTenantStatus(value: string): TenantStatus | null {
  return KNOWN_STATUSES.has(value) ? (value as TenantStatus) : null;
}

export class PrismaDashboardRepository implements DashboardRepositoryInterface {
  constructor(private readonly db: PrismaClient = prisma) {}

  async countTenantsByStatus(): Promise<TenantStatusCount[]> {
    const rows = await this.db.tenant.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    return rows.flatMap((row) => {
      const status = toTenantStatus(row.status);
      return status ? [{ status, count: row._count._all }] : [];
    });
  }

  async countTenantsCreatedBefore(date: Date): Promise<number> {
    return this.db.tenant.count({ where: { createdAt: { lt: date } } });
  }

  async findTenantCreatedDatesSince(date: Date): Promise<Date[]> {
    const rows = await this.db.tenant.findMany({
      where: { createdAt: { gte: date } },
      select: { createdAt: true },
    });
    return rows.map((row) => row.createdAt);
  }

  async findRecentTenants(limit: number): Promise<RecentTenantRecord[]> {
    const rows = await this.db.tenant.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        createdAt: true,
      },
    });

    return rows.flatMap((row) => {
      const status = toTenantStatus(row.status);
      return status ? [{ ...row, status }] : [];
    });
  }
}
