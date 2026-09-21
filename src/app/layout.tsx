import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Moodle Exam SaaS — Modern Exam Platform",
  description:
    "Next.js + Moodle Hexagonal Architecture Multi-tenant Exam Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full bg-background text-foreground antialiased selection:bg-primary/15 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
