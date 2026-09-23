import "server-only";

import { getAuthController } from "@/app/api/auth/_factory";

export async function GET(req: Request): Promise<Response> {
  return getAuthController().currentSession(req);
}
