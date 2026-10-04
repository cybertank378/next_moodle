import "server-only";

import { getDashboardController } from "@/app/api/dashboard/_factory";

export async function GET(req: Request): Promise<Response> {
  return getDashboardController().getAdminOverview(req);
}
