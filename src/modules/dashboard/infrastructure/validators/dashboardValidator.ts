import { ValidationError } from "@/core/errors/ValidationError";
import { ADMIN_DASHBOARD_DEFAULT_MONTHS } from "@/modules/dashboard/domain/types/DashboardTypes";

export interface AdminDashboardQuery {
  months: number;
}

export function parseAdminDashboardQuery(
  searchParams: URLSearchParams,
): AdminDashboardQuery {
  const raw = searchParams.get("months");
  if (raw === null || raw.trim() === "") {
    return { months: ADMIN_DASHBOARD_DEFAULT_MONTHS };
  }

  const months = Number(raw);
  if (!Number.isInteger(months) || months <= 0) {
    throw new ValidationError("Parameter 'months' harus bilangan bulat positif.");
  }
  return { months };
}
