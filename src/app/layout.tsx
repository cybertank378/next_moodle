import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Moodle Exam SaaS — Modern LMS Exam Platform",
  description: "Next.js + Moodle Hexagonal Multi-tenant Exam Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full bg-background font-sans antialiased">{children}</body>
    </html>
  );
}
