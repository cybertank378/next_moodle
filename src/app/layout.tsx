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
    <html lang="id" suppressHydrationWarning>
      <head>
        <script>
          {`try {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          } catch (_) {}`}
        </script>
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-[#1e1e2d] dark:text-gray-200 antialiased transition-colors duration-200">
        <AppToastProvider>{children}</AppToastProvider>
      </body>
    </html>
  );
}
