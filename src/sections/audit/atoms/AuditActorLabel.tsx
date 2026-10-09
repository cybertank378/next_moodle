import { UserRound } from "lucide-react";
export function getAuditActorLabel(name: string | null | undefined): string {
  return name?.trim() || "Nama pengguna tidak tersedia";
}
export function AuditActorLabel({ name }: { name: string | null | undefined }) {
  const label = getAuditActorLabel(name);
  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <UserRound size={17} aria-hidden="true" />
      </div>
      <p className="min-w-0 break-words text-sm font-semibold text-slate-800">
        {label}
      </p>
    </div>
  );
}
