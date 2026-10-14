import "server-only";
import { getAuditController } from "@/app/api/audit/_factory";

export async function POST(req: Request): Promise<Response> {
  return getAuditController().cleanup(req);
}
