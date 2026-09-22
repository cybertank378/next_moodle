import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/core/http/ApiResponse";
import { HttpStatus } from "@/core/http/HttpStatus";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";
import { getTenantController } from "./_factory";

export async function GET(req: NextRequest): Promise<NextResponse> {
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

  return getTenantController().list(actor, req);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
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

  return getTenantController().create(actor, req);
}
