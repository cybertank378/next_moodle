// Allowlist only; never serialize original payloads or nested objects.
const keys = new Set([
  "event",
  "operation",
  "outcome",
  "source",
  "requestId",
  "correlationId",
  "fieldCount",
  "recordCount",
]);
const secret =
  /bearer\s+\S+|basic\s+[a-z0-9+/=]+|(?:token|password|secret|api[_-]?key|authorization|cookie)\s*[:=]\s*\S+|-----BEGIN [A-Z ]*PRIVATE KEY-----/i;
export function sanitizeAuditMetadata(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const out: Record<string, unknown> = {};
  const obj = value as Record<string, unknown>;
  for (const [key, v] of Object.entries(obj)) {
    if (key === "changedFields" && Array.isArray(v)) {
      out.changedFields = v
        .filter(
          (x): x is string =>
            typeof x === "string" && /^[a-zA-Z][a-zA-Z0-9_]{0,59}$/.test(x),
        )
        .slice(0, 30);
      continue;
    }
    if (!keys.has(key)) continue;
    if (typeof v === "string")
      out[key] = secret.test(v) ? "[REDACTED]" : v.slice(0, 200);
    else if (typeof v === "boolean") out[key] = v;
    else if (typeof v === "number" && Number.isFinite(v)) out[key] = v;
  }
  return out;
}
