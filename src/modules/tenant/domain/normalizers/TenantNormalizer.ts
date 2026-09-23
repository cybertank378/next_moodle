export const TenantNormalizer = {
  slug(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  },

  name(value: string): string {
    return value.trim().replace(/\s+/g, " ");
  },

  customDomain(value: string | null | undefined): string | null {
    if (value == null || value.trim() === "") return null;
    return value.trim().toLowerCase();
  },

  moodleUrl(value: string): string {
    return value.trim().replace(/\/+$/, "");
  },
} as const;
