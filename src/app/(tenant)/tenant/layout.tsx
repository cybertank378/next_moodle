import type { ReactNode } from "react";
import AppLayout from "@/shared-ui/layout/AppLayout";

export default function TenantLayout({ children }: { children: ReactNode }) {
  return (
    <AppLayout userRole="TENANT" username="Operator Instansi">
      {children}
    </AppLayout>
  );
}
