import "server-only";
import { getFirebaseSubscriptionController } from "@/app/api/firebase/_factory";
import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";

async function originalPOST(req: Request): Promise<Response> {
  return getFirebaseSubscriptionController().subscribe(req);
}

async function originalDELETE(req: Request): Promise<Response> {
  return getFirebaseSubscriptionController().unsubscribe(req);
}

export const POST = withAuditedMutation(originalPOST, "firebase/subscribe");
export const DELETE = withAuditedMutation(originalDELETE, "firebase/subscribe");
