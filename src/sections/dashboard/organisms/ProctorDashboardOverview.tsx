import Card from "@/shared-ui/component/Card";
import Typography from "@/shared-ui/component/Typography";
import StatCard from "../molecules/StatCard";

export default function ProctorDashboardOverview() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-slate-200/60 dark:border-slate-800">
        <div>
          <Typography
            variant="h1"
            className="bg-gradient-to-r from-indigo-700 to-rose-600 dark:from-indigo-400 dark:to-rose-400 bg-clip-text text-transparent"
          >
            Proctor Console
          </Typography>
          <Typography
            variant="subheading"
            className="mt-1 text-slate-600 dark:text-slate-400"
          >
            Monitor live exam sessions and review suspicious activities.
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          label="Live Exams"
          value={3}
          hint="Sessions currently running"
          accent="indigo"
          loading={false}
          unavailable={false}
        />
        <StatCard
          label="Active Candidates"
          value={124}
          hint="Connected and monitoring"
          accent="emerald"
          loading={false}
          unavailable={false}
        />
        <StatCard
          label="Incident Flags"
          value={7}
          hint="Requires review"
          accent="rose"
          loading={false}
          unavailable={false}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-xl shadow-indigo-500/5 dark:shadow-none border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md overflow-hidden transition-colors">
          <div className="px-6 py-5 border-b border-slate-200/60 dark:border-slate-800">
            <Typography variant="h2" className="text-slate-900 dark:text-white">
              Active Monitoring Sessions
            </Typography>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-medium tracking-wider uppercase">
                  <th className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-800">
                    Exam Name
                  </th>
                  <th className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-800">
                    Time Remaining
                  </th>
                  <th className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-800">
                    Candidates
                  </th>
                  <th className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-800">
                    Flags
                  </th>
                  <th className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-800">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/60">
                <tr className="hover:bg-indigo-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      Midterm: Organic Chemistry
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Started: 09:00 AM
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                    45m 12s
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    42 / 45
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50">
                      3 New
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium transition-colors">
                      Enter Grid
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-indigo-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      Final: Software Architecture
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Started: 10:00 AM
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                    1h 15m 00s
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    82 / 85
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50">
                      0
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium transition-colors">
                      Enter Grid
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
