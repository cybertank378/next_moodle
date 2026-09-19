const SENSITIVE_KEYS = new Set([
  "password",
  "token",
  "accesstoken",
  "refreshtoken",
  "wstoken",
  "authorization",
  "cookie",
  "secret",
  "clientsecret",
  "apikey",
]);

// biome-ignore lint/complexity/noStaticOnlyClass: utility class with static helpers
export class SensitiveData {
  public static isSensitiveKey(key: string): boolean {
    const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (SENSITIVE_KEYS.has(normalized)) {
      return true;
    }
    for (const pattern of SENSITIVE_KEYS) {
      if (normalized.includes(pattern)) {
        return true;
      }
    }
    return false;
  }

  public static redact(target: unknown): unknown {
    if (target === null || target === undefined) {
      return target;
    }

    if (typeof target !== "object") {
      return target;
    }

    if (Array.isArray(target)) {
      return target.map((item) => SensitiveData.redact(item));
    }

    const output: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(
      target as Record<string, unknown>,
    )) {
      if (SensitiveData.isSensitiveKey(key)) {
        output[key] = "[REDACTED]";
      } else if (typeof value === "object" && value !== null) {
        output[key] = SensitiveData.redact(value);
      } else {
        output[key] = value;
      }
    }
    return output;
  }
}
