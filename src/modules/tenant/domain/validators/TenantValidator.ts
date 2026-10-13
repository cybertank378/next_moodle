import { ValidationError } from "@/core/errors/ValidationError";
import type { TenantStatus } from "@/modules/tenant/domain/types/TenantMetadata";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STATUSES: readonly TenantStatus[] = [
  "ACTIVE",
  "MAINTENANCE",
  "SUSPENDED",
];

interface TenantValidatorContract {
  slug(value: string): void;
  name(value: string): void;
  status(value: string): asserts value is TenantStatus;
  credential(input: {
    moodleUrl: string;
    adminToken: string;
    timeoutBudgetMs: number;
  }): void;
  adminUser(input: {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
  }): void;
}

const USERNAME_PATTERN = /^[a-z0-9_-]{3,50}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const TenantValidator: TenantValidatorContract = {
  adminUser(input: {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
  }): void {
    if (!USERNAME_PATTERN.test(input.username)) {
      throw new ValidationError(
        "Username tenant admin harus 3-50 karakter (huruf kecil, angka, underscore, atau hyphen).",
      );
    }
    if (!input.firstname.trim() || input.firstname.length > 100) {
      throw new ValidationError(
        "Nama depan tenant admin wajib diisi (maks 100 karakter).",
      );
    }
    if (!input.lastname.trim() || input.lastname.length > 100) {
      throw new ValidationError(
        "Nama belakang tenant admin wajib diisi (maks 100 karakter).",
      );
    }
    if (!EMAIL_PATTERN.test(input.email)) {
      throw new ValidationError("Format email tenant admin tidak valid.");
    }
    if (input.password !== undefined && input.password.length < 8) {
      throw new ValidationError("Password tenant admin minimal 8 karakter.");
    }
  },
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
      throw new ValidationError(
        "Moodle URL harus menggunakan HTTP atau HTTPS.",
      );
    }
    if (input.adminToken.trim().length < 8) {
      throw new ValidationError("Admin token wajib diisi.");
    }
    if (
      !Number.isInteger(input.timeoutBudgetMs) ||
      input.timeoutBudgetMs < 1000 ||
      input.timeoutBudgetMs > 60000
    ) {
      throw new ValidationError(
        "Timeout harus berada pada rentang 1000-60000 ms.",
      );
    }
  },
};
