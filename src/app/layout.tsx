// Files: src/app/layout.tsx

import "@/styles/globals.css";
import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { APP_DESCRIPTION, APP_NAME } from "@/libs/branding";
import AppToastProvider from "@/shared-ui/layout/AppToastProvider";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  applicationName: APP_NAME,
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  openGraph: {
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    title: APP_NAME,
    type: "website",
  },
  twitter: {
    card: "summary",
    description: APP_DESCRIPTION,
    title: APP_NAME,
  },
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
