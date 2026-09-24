import "@/styles/globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import AppToastProvider from "@/shared-ui/layout/AppToastProvider";

export const metadata: Metadata = {
  title: {
    default: "Exam SaaS",
    template: "%s | Exam SaaS",
  },
  description: "Platform SaaS Ujian Berbasis Moodle Multi-Tenant.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-[#1e1e2d] text-gray-200">
        <AppToastProvider>{children}</AppToastProvider>
      </body>
    </html>
  );
}
