import { ValidationError } from "@/core/errors/ValidationError";
import type { TenantStatus } from "@/modules/tenants/domain/types/TenantTypes";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STATUSES: readonly TenantStatus[] = ["ACTIVE", "MAINTENANCE", "SUSPENDED"];

export const TenantValidator = {
  slug(value: string): void {
    if (value.length < 3 || value.length > 63 || !SLUG_PATTERN.test(value)) {
      throw new ValidationError(
        "Slug tenant harus 3-63 karakter dan hanya berisi huruf kecil, angka, atau tanda hubung.",
      );
    }
  },

  name(value: string): void {
    if (value.length < 2 || value.length > 120) {
      throw new ValidationError("Nama tenant harus 2-120 karakter.");
    }
  },

  status(value: string): asserts value is TenantStatus {
    if (!STATUSES.includes(value as TenantStatus)) {
      throw new ValidationError("Status tenant tidak valid.");
    }
  },

  credential(input: {
    moodleUrl: string;
    adminToken: string;
    timeoutBudgetMs: number;
  }): void {
    let url: URL;
    try {
      url = new URL(input.moodleUrl);
    } catch {
      throw new ValidationError("Moodle URL tidak valid.");
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new ValidationError("Moodle URL harus menggunakan HTTP atau HTTPS.");
    }
    if (input.adminToken.trim().length < 8) {
      throw new ValidationError("Admin token wajib diisi.");
    }
    if (
      !Number.isInteger(input.timeoutBudgetMs) ||
      input.timeoutBudgetMs < 1000 ||
      input.timeoutBudgetMs > 60000
    ) {
      throw new ValidationError("Timeout harus berada pada rentang 1000-60000 ms.");
    }
  },
} as const;
