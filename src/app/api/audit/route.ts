import "server-only";
import { getAuditController } from "@/app/api/audit/_factory";
export async function GET(request: Request): Promise<Response> {
  return getAuditController().list(request);
}
