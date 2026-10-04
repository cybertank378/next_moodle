import type { TenantStatusType } from "@/libs/enums";
import type {
  TenantGrowthPoint,
  TenantStatusSummary,
} from "../types/DashboardTypes";

export interface RecentTenantResponseDto {
  id: string;
  name: string;
  slug: string;
  status: TenantStatusType;
  /** ISO-8601 timestamp. */
  createdAt: string;
}

export interface AdminDashboardResponseDto {
  summary: TenantStatusSummary;
  growth: TenantGrowthPoint[];
  recentTenants: RecentTenantResponseDto[];
}
