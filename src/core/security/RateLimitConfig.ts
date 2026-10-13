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

export interface RateLimitAuthContext {
  tenantId?: string | null;
  actorId?: string | null;
  scope?: string;
}

/**
 * Derive a rate-limit key from the request.
 * For authenticated requests, uses tenant + actor + scope to avoid blocking whole schools on shared IPs.
 * For anonymous/external requests, falls back to reverse proxy IP headers.
 */
export function resolveRateLimitKey(
  req: Request,
  authContext?: RateLimitAuthContext,
): string {
  if (authContext?.actorId) {
    const tenant = authContext.tenantId || "global";
    const scope = authContext.scope || "default";
    return `actor:${tenant}:${authContext.actorId}:${scope}`;
  }

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "anonymous";
}

