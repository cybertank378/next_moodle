/**
 * TenantSlug value object.
 * Encapsulates slug validation rules for Tenant.
 * A valid slug is all-lowercase alphanumeric with hyphens (no leading/trailing hyphens,
 * no consecutive hyphens), length 3–63.
 */
export class TenantSlug {
  private static readonly PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 63;

  private constructor(private readonly value: string) {}

  static create(
    raw: string,
  ): { ok: true; slug: TenantSlug } | { ok: false; error: string } {
    const trimmed = raw.trim().toLowerCase();

    if (trimmed.length < TenantSlug.MIN_LENGTH) {
      return {
        ok: false,
        error: `Slug terlalu pendek (minimal ${TenantSlug.MIN_LENGTH} karakter).`,
      };
    }

    if (trimmed.length > TenantSlug.MAX_LENGTH) {
      return {
        ok: false,
        error: `Slug terlalu panjang (maksimal ${TenantSlug.MAX_LENGTH} karakter).`,
      };
    }

    if (!TenantSlug.PATTERN.test(trimmed)) {
      return {
        ok: false,
        error:
          "Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung. Tidak boleh diawali, diakhiri, atau memiliki tanda hubung berurutan.",
      };
    }

    return { ok: true, slug: new TenantSlug(trimmed) };
  }

  static isValid(raw: string): boolean {
    const result = TenantSlug.create(raw);
    return result.ok;
  }

  toString(): string {
    return this.value;
  }

  equals(other: TenantSlug): boolean {
    return this.value === other.value;
  }
}
