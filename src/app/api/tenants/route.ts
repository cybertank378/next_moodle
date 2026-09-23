import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/core/http/ApiResponse";
import { HttpStatus } from "@/core/http/HttpStatus";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";
import { getTenantsController } from "@/app/api/tenants/_factory";

function unauthorized(): NextResponse {
  return NextResponse.json(
    ApiResponse.error(
      "UNAUTHORIZED",
      "Sesi tidak valid atau telah berakhir.",
      HttpStatus.UNAUTHORIZED,
    ).body,
    { status: HttpStatus.UNAUTHORIZED },
  );
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const actor = await getCurrentUser();
  return actor ? getTenantsController().list(actor, req) : unauthorized();
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const actor = await getCurrentUser();
  return actor ? getTenantsController().create(actor, req) : unauthorized();
}
