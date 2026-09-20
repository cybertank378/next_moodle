import { randomUUID } from "node:crypto";

export function generateRequestId(): string {
  return randomUUID();
}

export function getOrGenerateRequestId(
  requestOrHeaders?: Request | Headers | null,
): string {
  if (!requestOrHeaders) {
    return generateRequestId();
  }

  let incomingId: string | null = null;
  if (
    "headers" in requestOrHeaders &&
    typeof requestOrHeaders.headers.get === "function"
  ) {
    incomingId = requestOrHeaders.headers.get("x-request-id");
  } else if (typeof (requestOrHeaders as Headers).get === "function") {
    incomingId = (requestOrHeaders as Headers).get("x-request-id");
  }

  if (incomingId && incomingId.trim().length > 0) {
    // Sanitize incoming ID to ensure it is safe and does not contain line breaks or malicious characters
    const sanitized = incomingId.trim().slice(0, 128);
    if (/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
      return sanitized;
    }
  }

  return generateRequestId();
}
