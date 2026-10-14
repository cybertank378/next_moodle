import "server-only";

import type { NextRequest, NextResponse } from "next/server";

import { getSettingsController } from "@/app/api/settings/_factory";

export async function GET(request: NextRequest): Promise<NextResponse> {
  return getSettingsController().getSettings(request);
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  return getSettingsController().updateSettings(request);
}
