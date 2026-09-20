import { ValidationError } from "@/core/errors/ValidationError";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class TenantSlug {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static normalize(value: string): string {
    return value.trim().toLowerCase();
  }

  public static isValid(value: string): boolean {
    if (!value) {
      return false;
    }
    const normalized = TenantSlug.normalize(value);
    return SLUG_REGEX.test(normalized);
  }

  public static create(raw: string): TenantSlug {
    if (!raw || typeof raw !== "string") {
      throw new ValidationError("Slug tenant wajib diisi dan berupa string.");
    }

    const normalized = TenantSlug.normalize(raw);

    if (!SLUG_REGEX.test(normalized)) {
      throw new ValidationError(
        `Format slug tenant '${raw}' tidak valid. Gunakan huruf kecil, angka, dan tanda hubung (-).`,
        { code: "TENANT_SLUG_INVALID", field: "slug" },
      );
    }

    return new TenantSlug(normalized);
  }

  public toString(): string {
    return this.value;
  }
}
