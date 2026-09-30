import {
  InMemoryRateLimiter,
  type RateLimiter,
  type RateLimiterOptions,
} from "@/core/security/RateLimiter";

/**
 * Shared rate limiter instances per scope.
 *
 * Infrastructure concern — do not import from domain or application layers.
 * Each scope has its own bucket (window + limit). Route handlers select a scope
 * via the `rateLimitScope` option passed to `withApiHandler`.
 */

export type RateLimitScope = "default" | "auth" | "attempt" | "none";

const DEFAULT_OPTIONS: Record<
  Exclude<RateLimitScope, "none">,
  RateLimiterOptions
> = {
  /** General API: 100 req / 60 s per key */
  default: { limit: 100, windowMs: 60_000 },
  /** Auth endpoints (login, refresh): tighter window — 10 req / 60 s */
  auth: { limit: 10, windowMs: 60_000 },
  /** Quiz attempt endpoints: 30 req / 60 s */
  attempt: { limit: 30, windowMs: 60_000 },
};

const instances = new Map<Exclude<RateLimitScope, "none">, RateLimiter>();

export function getRateLimiter(
  scope: Exclude<RateLimitScope, "none">,
): RateLimiter {
  let limiter = instances.get(scope);
  if (!limiter) {
    limiter = new InMemoryRateLimiter(DEFAULT_OPTIONS[scope]);
    instances.set(scope, limiter);
  }
  return limiter;
}

/**
 * Derive a rate-limit key from the request.
 * Uses `x-forwarded-for` when behind a reverse proxy, falling back to
 * `x-real-ip` or a constant key for local development.
 */
export function resolveRateLimitKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "anonymous";
}
