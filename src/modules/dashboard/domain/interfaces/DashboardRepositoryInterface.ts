import type {
  RecentTenantRecord,
  TenantStatusCount,
} from "../types/DashboardTypes";

export interface DashboardRepositoryInterface {
  countTenantsByStatus(): Promise<TenantStatusCount[]>;
  countTenantsCreatedBefore(date: Date): Promise<number>;
  findTenantCreatedDatesSince(date: Date): Promise<Date[]>;
  findRecentTenants(limit: number): Promise<RecentTenantRecord[]>;
}
