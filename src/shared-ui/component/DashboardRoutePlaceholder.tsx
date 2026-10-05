interface DashboardRoutePlaceholderProps {
  title: string;
  description: string;
}

export default function DashboardRoutePlaceholder({
  title,
  description,
}: DashboardRoutePlaceholderProps) {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 ">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-500 ">
          {description}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200  bg-white  p-6 shadow-sm">
        <p className="text-sm text-slate-700 ">
          Route dan authorization boundary sudah tersedia. Business logic akan
          diimplementasikan pada issue feature terkait.
        </p>
      </div>
    </section>
  );
}
