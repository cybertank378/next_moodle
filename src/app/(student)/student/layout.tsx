import type { ReactNode } from "react";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b px-6 py-4">
        <h1 className="text-xl font-bold">Student Portal</h1>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
