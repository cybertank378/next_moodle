import { Result } from "@/core/base/Result";
import { Permission } from "@/core/rbac/Permission";
import { authorizeDashboardOperation } from "../services/DashboardAuthorizationService";
import type { GetAdminDashboardRequestDto } from "../../domain/dto/DashboardRequestDto";
import type { AdminDashboardResponseDto } from "../../domain/dto/DashboardResponseDto";
import type { DashboardRepositoryInterface } from "../../domain/interfaces/DashboardRepositoryInterface";
import { DashboardMapper } from "../../domain/mapper/DashboardMapper";
import {
  ADMIN_DASHBOARD_MAX_MONTHS,
  ADMIN_DASHBOARD_MIN_MONTHS,
  ADMIN_DASHBOARD_RECENT_TENANT_LIMIT,
} from "../../domain/types/DashboardTypes";

export class GetAdminDashboardUseCase {
  constructor(
    private readonly repository: DashboardRepositoryInterface,
    private readonly clock: () => Date = () => new Date(),
  ) {}

  async execute(
    input: GetAdminDashboardRequestDto,
  ): Promise<Result<AdminDashboardResponseDto, Error>> {
    const authError = authorizeDashboardOperation(
      input.actor,
      Permission.ADMIN_DASHBOARD_READ,
    );
    if (authError) return Result.fail(authError);

    const months = Math.min(
      ADMIN_DASHBOARD_MAX_MONTHS,
      Math.max(ADMIN_DASHBOARD_MIN_MONTHS, Math.trunc(input.months)),
    );
    const now = this.clock();
    const windowStart = DashboardMapper.growthWindowStart(now, months);

    const [statusCounts, baselineCount, createdDates, recent] =
      await Promise.all([
        this.repository.countTenantsByStatus(),
        this.repository.countTenantsCreatedBefore(windowStart),
        this.repository.findTenantCreatedDatesSince(windowStart),
        this.repository.findRecentTenants(ADMIN_DASHBOARD_RECENT_TENANT_LIMIT),
      ]);

    return Result.ok({
      summary: DashboardMapper.toStatusSummary(statusCounts),
      growth: DashboardMapper.buildMonthlyGrowth({
        createdDates,
        baselineCount,
        months,
        now,
      }),
      recentTenants: recent.map(DashboardMapper.toRecentTenantResponse),
    });
  }
}
