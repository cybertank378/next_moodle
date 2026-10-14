import "server-only";
import { getSettingsController } from "@/app/api/settings/_factory";

export async function GET(request: Request): Promise<Response> {
  return getSettingsController().getSettings(request);
}

export async function PATCH(request: Request): Promise<Response> {
  return getSettingsController().updateSettings(request);
}
