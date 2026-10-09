import { redirect } from "next/navigation";
import { ROUTES } from "@/libs/routes";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

export default async function RootPage() {
  const actor = await getCurrentUser();

  if (!actor) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  redirect(ROUTES.ADMIN.ROOT);
}
