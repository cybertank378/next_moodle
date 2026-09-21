const SENSITIVE_KEY_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /authorization/i,
  /cookie/i,
  /api[_-]?key/i,
  /credential/i,
  /private[_-]?key/i,
  /session[_-]?token/i,
];

export function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
}

export function redactSensitiveData<T>(data: T, seen = new WeakSet()): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data !== "object") {
    return data;
  }

  // Avoid circular references
  if (seen.has(data as object)) {
    return "[CIRCULAR]" as unknown as T;
  }
  seen.add(data as object);

  if (Array.isArray(data)) {
    return data.map((item) => redactSensitiveData(item, seen)) as unknown as T;
  }

  const redacted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (isSensitiveKey(key)) {
      redacted[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      redacted[key] = redactSensitiveData(value, seen);
    } else {
      redacted[key] = value;
    }
  }

  return redacted as T;
}
