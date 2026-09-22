import { ValidationError } from "@/core/errors/ValidationError";

export type TenantStatus = "ACTIVE" | "MAINTENANCE" | "SUSPENDED";

export interface TenantContext {
  tenantId: string;
  tenantSlug: string;
  status: TenantStatus;
  customDomain?: string;
}

const VALID_STATUSES: readonly TenantStatus[] = [
  "ACTIVE",
  "MAINTENANCE",
  "SUSPENDED",
] as const;

export function validateTenantContext(context: unknown): TenantContext {
  if (!context || typeof context !== "object") {
    throw new ValidationError(
      "Invalid tenant context: tenant context must be a non-null object.",
    );
  }

  const candidate = context as Partial<TenantContext>;

  if (
    !candidate.tenantId ||
    typeof candidate.tenantId !== "string" ||
    candidate.tenantId.trim().length === 0
  ) {
    throw new ValidationError(
      "Invalid tenant context: tenantId is required and cannot be empty.",
    );
  }

  if (
    !candidate.tenantSlug ||
    typeof candidate.tenantSlug !== "string" ||
    candidate.tenantSlug.trim().length === 0
  ) {
    throw new ValidationError(
      "Invalid tenant context: tenantSlug is required and cannot be empty.",
    );
  }

  if (
    !candidate.status ||
    typeof candidate.status !== "string" ||
    !VALID_STATUSES.includes(candidate.status as TenantStatus)
  ) {
    throw new ValidationError(
      `Invalid tenant context: status must be one of [${VALID_STATUSES.join(", ")}].`,
    );
  }

  return {
    tenantId: candidate.tenantId.trim(),
    tenantSlug: candidate.tenantSlug.trim(),
    status: candidate.status as TenantStatus,
    customDomain: candidate.customDomain
      ? candidate.customDomain.trim()
      : undefined,
  };
}
