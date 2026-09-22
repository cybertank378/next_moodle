import { ValidationError } from "@/core/errors/ValidationError";

export interface CreateTenantBody {
  slug: string;
  name: string;
  customDomain?: string | null;
}

export interface UpdateTenantBody {
  name?: string;
  customDomain?: string | null;
}

export interface UpdateTenantStatusBody {
  status: string;
}

export interface ListTenantsQuery {
  status?: string;
  search?: string;
  page?: string;
  pageSize?: string;
}

const VALID_STATUSES = new Set(["ACTIVE", "MAINTENANCE", "SUSPENDED"]);

export function validateCreateTenantBody(body: unknown): CreateTenantBody {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Body permintaan tidak valid.");
  }

  const b = body as Record<string, unknown>;

  if (typeof b.slug !== "string" || b.slug.trim().length === 0) {
    throw new ValidationError("Field 'slug' wajib diisi dan berupa string.");
  }

  if (typeof b.name !== "string" || b.name.trim().length === 0) {
    throw new ValidationError("Field 'name' wajib diisi dan berupa string.");
  }

  if (
    b.customDomain !== undefined &&
    b.customDomain !== null &&
    typeof b.customDomain !== "string"
  ) {
    throw new ValidationError(
      "Field 'customDomain' harus berupa string atau null.",
    );
  }

  return {
    slug: b.slug.trim(),
    name: b.name.trim(),
    customDomain:
      b.customDomain !== undefined
        ? (b.customDomain as string | null)
        : undefined,
  };
}

export function validateUpdateTenantBody(body: unknown): UpdateTenantBody {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Body permintaan tidak valid.");
  }

  const b = body as Record<string, unknown>;

  if (
    b.name !== undefined &&
    (typeof b.name !== "string" || b.name.trim().length === 0)
  ) {
    throw new ValidationError("Field 'name' harus berupa string tidak kosong.");
  }

  if (
    b.customDomain !== undefined &&
    b.customDomain !== null &&
    typeof b.customDomain !== "string"
  ) {
    throw new ValidationError(
      "Field 'customDomain' harus berupa string atau null.",
    );
  }

  return {
    name: typeof b.name === "string" ? b.name.trim() : undefined,
    customDomain:
      b.customDomain !== undefined
        ? (b.customDomain as string | null)
        : undefined,
  };
}

export function validateUpdateTenantStatusBody(
  body: unknown,
): UpdateTenantStatusBody {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Body permintaan tidak valid.");
  }

  const b = body as Record<string, unknown>;

  if (typeof b.status !== "string" || !VALID_STATUSES.has(b.status)) {
    throw new ValidationError(
      `Field 'status' harus salah satu dari: ${[...VALID_STATUSES].join(", ")}.`,
    );
  }

  return { status: b.status };
}

export function parseListTenantsQuery(query: ListTenantsQuery) {
  let status: "ACTIVE" | "MAINTENANCE" | "SUSPENDED" | undefined;
  if (query.status && VALID_STATUSES.has(query.status)) {
    status = query.status as "ACTIVE" | "MAINTENANCE" | "SUSPENDED";
  }

  const page = query.page ? Math.max(1, Number.parseInt(query.page, 10)) : 1;
  const pageSize = query.pageSize
    ? Math.min(100, Math.max(1, Number.parseInt(query.pageSize, 10)))
    : 20;

  return {
    status,
    search: query.search,
    page: Number.isNaN(page) ? 1 : page,
    pageSize: Number.isNaN(pageSize) ? 20 : pageSize,
  };
}
