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
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          {description}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#151521] p-6 shadow-sm">
        <p className="text-sm text-slate-700 dark:text-gray-300">
          Route dan authorization boundary sudah tersedia. Business logic akan
          diimplementasikan pada issue feature terkait.
        </p>
      </div>
    </section>
  );
}
