import type { ReactNode } from "react";

export default function TenantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b px-6 py-4">
        <h1 className="text-xl font-bold">Tenant Portal</h1>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
