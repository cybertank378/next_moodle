import type { ReactNode } from "react";
import AppLayout from "@/shared-ui/layout/AppLayout";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppLayout userRole="ADMIN" username="Administrator">
      {children}
    </AppLayout>
  );
}
