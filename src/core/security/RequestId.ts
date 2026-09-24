import { randomUUID } from "node:crypto";

export function generateRequestId(): string {
  const uuid = randomUUID().replace(/-/g, "");
  return `req_${uuid}`;
}

export function resolveRequestId(request?: Request | Headers): string {
  if (!request) {
    return generateRequestId();
  }

  const headers = request instanceof Request ? request.headers : request;
  const existingId = headers.get("x-request-id");

  if (existingId && existingId.trim().length > 0) {
    return existingId.trim();
  }

  return generateRequestId();
}
