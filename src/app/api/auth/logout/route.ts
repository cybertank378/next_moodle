import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import "server-only";

import { getAuthController } from "@/app/api/auth/_factory";

async function originalPOST(req: Request): Promise<Response> {
  return getAuthController().logout(req);
}

export const POST = withAuditedMutation(originalPOST, "auth/logout");
