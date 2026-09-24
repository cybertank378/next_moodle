import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getTenantsController } from "@/app/api/tenants/_factory";
import { ApiResponse } from "@/core/http/ApiResponse";
import { HttpStatus } from "@/core/http/HttpStatus";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

interface RouteContext {
  params: Promise<{ tenantId: string }>;
}

export async function PUT(
  req: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const actor = await getCurrentUser();
  if (!actor) {
    return NextResponse.json(
      ApiResponse.error(
        "UNAUTHORIZED",
        "Sesi tidak valid atau telah berakhir.",
        HttpStatus.UNAUTHORIZED,
      ).body,
      { status: HttpStatus.UNAUTHORIZED },
    );
  }

  const { tenantId } = await context.params;
  return getTenantsController().configureCredentials(actor, tenantId, req);
}
