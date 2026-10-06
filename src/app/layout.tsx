// Files: src/app/layout.tsx

import "@/styles/globals.css";
import "katex/dist/katex.min.css";
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
    <html lang="id" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900   antialiased transition-colors duration-200">
        <AppToastProvider>{children}</AppToastProvider>
      </body>
    </html>
  );
}
