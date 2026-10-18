import { NextResponse } from "next/server";
import "server-only";
import { revalidatePath } from "next/cache";
import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { GetPlatformSettingsUseCase } from "@/modules/settings/application/usecases/GetPlatformSettingsUseCase";
import type { UpdatePlatformSettingsUseCase } from "@/modules/settings/application/usecases/UpdatePlatformSettingsUseCase";

const HEADERS = {
  "Cache-Control": "private, no-store",
  Vary: "Cookie, Authorization",
};

function failure(error: unknown): NextResponse {
  if (
    error instanceof Error &&
    "statusCode" in error &&
    error.statusCode === 409
  ) {
    return NextResponse.json(
      ApiResponse.error("SETTINGS_CONFLICT", error.message, 409).body,
      { status: 409, headers: HEADERS },
    );
  }
  const mapped = mapErrorToHttpResponse(error);
  return NextResponse.json(mapped.body, {
    status: mapped.status,
    headers: HEADERS,
  });
}

export class SettingsController {
  constructor(
    private readonly getPlatformSettingsUseCase: GetPlatformSettingsUseCase,
    private readonly updatePlatformSettingsUseCase: UpdatePlatformSettingsUseCase,
  ) {}

  async getSettings(request: Request): Promise<NextResponse> {
    try {
      const actor = await resolveCurrentActor(request);
      const data = await this.getPlatformSettingsUseCase.execute(actor);
      return NextResponse.json(ApiResponse.success(data).body, {
        headers: HEADERS,
      });
    } catch (error) {
      return failure(error);
    }
  }

  async updateSettings(request: Request): Promise<NextResponse> {
    try {
      const actor = await resolveCurrentActor(request);
      const input: unknown = await request.json();
      const data = await this.updatePlatformSettingsUseCase.execute(
        actor,
        input,
      );
      revalidatePath("/", "layout");
      revalidatePath("/manifest.webmanifest");
      return NextResponse.json(ApiResponse.success(data).body, {
        headers: HEADERS,
      });
    } catch (error) {
      return failure(error);
    }
  }
}
