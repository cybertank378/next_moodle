import { ValidationError } from "@/core/errors/ValidationError";
import type { TenantStatus } from "@/modules/tenant/domain/types/TenantStatus";
import { TenantSlug } from "@/modules/tenant/domain/value-objects/TenantSlug";

// biome-ignore lint/complexity/noStaticOnlyClass: domain validator utility
export class TenantValidator {
  public static validateSlug(slug: string): string {
    return TenantSlug.create(slug).value;
  }

  public static validateName(name: string): string {
    if (!name || typeof name !== "string" || !name.trim()) {
      throw new ValidationError("Nama tenant wajib diisi.", {
        code: "TENANT_NAME_REQUIRED",
        field: "name",
      });
    }
    return name.trim();
  }

  public static validateMoodleBaseUrl(url: string): string {
    if (!url || typeof url !== "string" || !url.trim()) {
      throw new ValidationError("Moodle Base URL wajib diisi.", {
        code: "TENANT_MOODLE_URL_REQUIRED",
        field: "moodleBaseUrl",
      });
    }

    const trimmed = url.trim();
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(trimmed);
    } catch {
      throw new ValidationError(
        `Format Moodle Base URL '${url}' tidak valid.`,
        { code: "TENANT_CONFIGURATION_INVALID", field: "moodleBaseUrl" },
      );
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new ValidationError(
        `Skema protokol '${parsedUrl.protocol}' tidak diizinkan. Hanya http dan https yang didukung.`,
        { code: "TENANT_CONFIGURATION_INVALID", field: "moodleBaseUrl" },
      );
    }

    return trimmed.replace(/\/+$/, "");
  }

  public static validateStatus(status: unknown): TenantStatus {
    const validStatuses: TenantStatus[] = ["ACTIVE", "INACTIVE", "SUSPENDED"];
    if (
      typeof status !== "string" ||
      !validStatuses.includes(status as TenantStatus)
    ) {
      throw new ValidationError(
        `Status '${String(status)}' tidak valid. Gunakan salah satu dari: ${validStatuses.join(", ")}`,
        { code: "TENANT_STATUS_INVALID", field: "status" },
      );
    }
    return status as TenantStatus;
  }
}
