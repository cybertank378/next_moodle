import { redirect } from "next/navigation";
import { ROUTES } from "@/libs/routes";
import { redirectByRole } from "@/libs/utils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

export default async function RootPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.AUTH.LOGIN);
  }

  redirect(redirectByRole(user.role));
}
