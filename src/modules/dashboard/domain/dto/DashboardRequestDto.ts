import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";

export interface GetAdminDashboardRequestDto {
  actor: AuthorizationActor | null | undefined;
  months: number;
}
