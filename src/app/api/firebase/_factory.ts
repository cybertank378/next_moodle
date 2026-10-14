import "server-only";
import { FirebaseSubscriptionController } from "@/modules/notification/infrastructure/http/FirebaseSubscriptionController";

const controller = new FirebaseSubscriptionController();

export function getFirebaseSubscriptionController(): FirebaseSubscriptionController {
  return controller;
}
