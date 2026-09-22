import type { ReactNode } from "react";
import AppLayout from "@/shared-ui/layout/AppLayout";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <AppLayout userRole="STUDENT" username="Peserta Ujian">
      {children}
    </AppLayout>
  );
}
