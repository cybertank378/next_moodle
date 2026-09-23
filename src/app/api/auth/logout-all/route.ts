import "server-only";

import { getAuthController } from "@/app/api/auth/_factory";

export async function POST(req: Request): Promise<Response> {
  return getAuthController().logoutAll(req);
}
