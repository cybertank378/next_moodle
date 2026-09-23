export default function TenantEmptyState({
  title = "Belum ada tenant",
  description = "Data tenant yang sesuai filter belum tersedia.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="py-10 text-center">
      <p className="font-semibold text-slate-800">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
