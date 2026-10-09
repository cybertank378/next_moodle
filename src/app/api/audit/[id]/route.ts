import "server-only";
import { getAuditController } from "@/app/api/audit/_factory";
export async function GET(
  request: Request,
  context: RouteContext<"/api/audit/[id]">,
): Promise<Response> {
  const { id } = await context.params;
  return getAuditController().detail(request, id);
}
