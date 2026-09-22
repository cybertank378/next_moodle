import { redirect } from "next/navigation";
import { redirectByRole } from "@/libs/utils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

export default async function RootPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  redirect(redirectByRole(user.role));
}
