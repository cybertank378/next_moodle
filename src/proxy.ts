import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRateLimiter } from "@/core/security/RateLimitConfig";

export async function proxy(request: NextRequest) {
  // Coarse rate limiting on API paths
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "anonymous";
  const limiter = getRateLimiter("default");
  const result = await limiter.limit(`proxy:${ip}`);

  if (!result.success) {
    const retryAfterSec = Math.ceil((result.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RATE_LIMITED",
          message: "Terlalu banyak permintaan, silakan coba beberapa saat lagi.",
        },
      },
      {
        status: 429,
        headers: {
          "retry-after": String(retryAfterSec),
          "cache-control": "private, no-store",
        },
      },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
