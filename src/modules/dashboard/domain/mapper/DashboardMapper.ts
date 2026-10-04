import { TenantStatus } from "@/libs/enums";
import type { RecentTenantResponseDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";
import type {
  RecentTenantRecord,
  TenantGrowthPoint,
  TenantStatusCount,
  TenantStatusSummary,
} from "@/modules/dashboard/domain/types/DashboardTypes";

function toPeriodKey(date: Date): string {
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${date.getUTCFullYear()}-${month}`;
}

/** First instant (UTC) of the month `offset` months before `now`'s month. */
function startOfMonthOffset(now: Date, offset: number): Date {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1),
  );
}

export const DashboardMapper = {
  growthWindowStart(now: Date, months: number): Date {
    return startOfMonthOffset(now, months - 1);
  },

  buildMonthlyGrowth(input: {
    createdDates: Date[];
    baselineCount: number;
    months: number;
    now: Date;
  }): TenantGrowthPoint[] {
    const buckets = new Map<string, number>();
    for (let offset = input.months - 1; offset >= 0; offset--) {
      buckets.set(toPeriodKey(startOfMonthOffset(input.now, offset)), 0);
    }

    for (const date of input.createdDates) {
      const key = toPeriodKey(date);
      const current = buckets.get(key);
      if (current !== undefined) buckets.set(key, current + 1);
    }

    let cumulative = input.baselineCount;
    return Array.from(buckets, ([period, newTenants]) => {
      cumulative += newTenants;
      return { period, newTenants, cumulativeTenants: cumulative };
    });
  },

  toStatusSummary(counts: TenantStatusCount[]): TenantStatusSummary {
    const byStatus = (status: TenantStatus): number =>
      counts.find((c) => c.status === status)?.count ?? 0;

    const active = byStatus(TenantStatus.ACTIVE);
    const maintenance = byStatus(TenantStatus.MAINTENANCE);
    const suspended = byStatus(TenantStatus.SUSPENDED);

    return {
      total: active + maintenance + suspended,
      active,
      maintenance,
      suspended,
    };
  },

  toRecentTenantResponse(record: RecentTenantRecord): RecentTenantResponseDto {
    return {
      id: record.id,
      name: record.name,
      slug: record.slug,
      status: record.status,
      createdAt: record.createdAt.toISOString(),
    };
  },
};
