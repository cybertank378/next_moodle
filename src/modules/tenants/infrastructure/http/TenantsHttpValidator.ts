import { ValidationError } from "@/core/errors/ValidationError";
import type {
  ConfigureTenantCredentialRequestDTO,
  CreateTenantRequestDTO,
  UpdateTenantRequestDTO,
} from "@/modules/tenants/domain/dto/TenantDTOs";
import type {
  TenantListFilter,
  TenantStatus,
} from "@/modules/tenants/domain/types/TenantTypes";
import { TenantValidator } from "@/modules/tenants/domain/validators/TenantValidator";

function asObject(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ValidationError("Body permintaan harus berupa object JSON.");
  }
  return input as Record<string, unknown>;
}

export function parseCreateTenantBody(input: unknown): CreateTenantRequestDTO {
  const body = asObject(input);
  if (typeof body.slug !== "string" || typeof body.name !== "string") {
    throw new ValidationError("Field slug dan name wajib berupa string.");
  }
  if (
    body.customDomain !== undefined &&
    body.customDomain !== null &&
    typeof body.customDomain !== "string"
  ) {
    throw new ValidationError("customDomain harus string atau null.");
  }
  return {
    slug: body.slug,
    name: body.name,
    customDomain:
      body.customDomain === undefined
        ? undefined
        : (body.customDomain as string | null),
  };
}

export function parseUpdateTenantBody(input: unknown): UpdateTenantRequestDTO {
  const body = asObject(input);
  if (body.name !== undefined && typeof body.name !== "string") {
    throw new ValidationError("name harus berupa string.");
  }
  if (
    body.customDomain !== undefined &&
    body.customDomain !== null &&
    typeof body.customDomain !== "string"
  ) {
    throw new ValidationError("customDomain harus string atau null.");
  }
  return {
    name: body.name as string | undefined,
    customDomain:
      body.customDomain === undefined
        ? undefined
        : (body.customDomain as string | null),
  };
}

export function parseStatusBody(input: unknown): TenantStatus {
  const body = asObject(input);
  if (typeof body.status !== "string") {
    throw new ValidationError("status wajib berupa string.");
  }
  TenantValidator.status(body.status);
  return body.status;
}

export function parseCredentialBody(
  input: unknown,
): ConfigureTenantCredentialRequestDTO {
  const body = asObject(input);
  if (
    typeof body.moodleUrl !== "string" ||
    typeof body.adminToken !== "string"
  ) {
    throw new ValidationError("moodleUrl dan adminToken wajib berupa string.");
  }
  if (
    body.proctorToken !== undefined &&
    body.proctorToken !== null &&
    typeof body.proctorToken !== "string"
  ) {
    throw new ValidationError("proctorToken harus string atau null.");
  }
  if (
    body.timeoutBudgetMs !== undefined &&
    typeof body.timeoutBudgetMs !== "number"
  ) {
    throw new ValidationError("timeoutBudgetMs harus berupa number.");
  }
  if (body.sslVerify !== undefined && typeof body.sslVerify !== "boolean") {
    throw new ValidationError("sslVerify harus berupa boolean.");
  }
  return {
    moodleUrl: body.moodleUrl,
    adminToken: body.adminToken,
    proctorToken:
      body.proctorToken === undefined
        ? undefined
        : (body.proctorToken as string | null),
    timeoutBudgetMs: body.timeoutBudgetMs as number | undefined,
    sslVerify: body.sslVerify as boolean | undefined,
  };
}

export function parseListTenantQuery(
  searchParams: URLSearchParams,
): Partial<TenantListFilter> {
  const statusRaw = searchParams.get("status");
  let status: TenantStatus | undefined;
  if (statusRaw) {
    TenantValidator.status(statusRaw);
    status = statusRaw;
  }

  const pageRaw = searchParams.get("page");
  const pageSizeRaw = searchParams.get("pageSize");
  const page = pageRaw ? Number.parseInt(pageRaw, 10) : 1;
  const pageSize = pageSizeRaw ? Number.parseInt(pageSizeRaw, 10) : 10;

  if (!Number.isInteger(page) || page < 1) {
    throw new ValidationError("page harus integer minimal 1.");
  }
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new ValidationError("pageSize harus integer 1-100.");
  }

  return {
    status,
    search: searchParams.get("search")?.trim() || undefined,
    page,
    pageSize,
  };
}
