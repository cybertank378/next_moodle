import Card from "@/shared-ui/component/Card";
import LinkButton from "@/shared-ui/component/LinkButton";
import Typography from "@/shared-ui/component/Typography";

export default function TenantDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography
            variant="h1"
            className="bg-gradient-to-r from-blue-700 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
          >
            Tenant Dashboard
          </Typography>
          <Typography
            variant="subheading"
            className="mt-1 text-slate-600 dark:text-slate-400"
          >
            Welcome, Administrator. Kelola ujian, peserta, dan pantau aktivitas.
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 shadow-lg shadow-blue-500/5 dark:shadow-none transition-all duration-300 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-bl-full -mr-12 -mt-12 opacity-50 dark:opacity-100 transition-colors"></div>
          <Typography
            variant="subheading"
            className="mb-1 text-slate-500 dark:text-slate-400 relative z-10"
          >
            Active Exams
          </Typography>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white relative z-10">
            48
          </p>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium relative z-10 flex items-center">
            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full mr-2 border border-emerald-200 dark:border-emerald-800/50">
              +8%
            </span>
            2 pending
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 shadow-lg shadow-blue-500/5 dark:shadow-none transition-all duration-300 hover:shadow-xl hover:border-cyan-200 dark:hover:border-cyan-800/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-100 dark:bg-cyan-900/20 rounded-bl-full -mr-12 -mt-12 opacity-50 dark:opacity-100 transition-colors"></div>
          <Typography
            variant="subheading"
            className="mb-1 text-slate-500 dark:text-slate-400 relative z-10"
          >
            Questions in Bank
          </Typography>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white relative z-10">
            14,250
          </p>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium relative z-10">
            Across 5 categories
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 shadow-lg shadow-blue-500/5 dark:shadow-none transition-all duration-300 hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 dark:bg-indigo-900/20 rounded-bl-full -mr-12 -mt-12 opacity-50 dark:opacity-100 transition-colors"></div>
          <Typography
            variant="subheading"
            className="mb-1 text-slate-500 dark:text-slate-400 relative z-10"
          >
            Registered Users
          </Typography>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white relative z-10">
            28,500
          </p>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium relative z-10">
            Active Users: 24.1k
          </div>
        </Card>

        <Card className="relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 shadow-lg shadow-blue-500/5 dark:shadow-none transition-all duration-300 hover:shadow-xl hover:border-amber-200 dark:hover:border-amber-800/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100 dark:bg-amber-900/20 rounded-bl-full -mr-12 -mt-12 opacity-50 dark:opacity-100 transition-colors"></div>
          <Typography
            variant="subheading"
            className="mb-1 text-slate-500 dark:text-slate-400 relative z-10"
          >
            Avg. Score
          </Typography>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white relative z-10">
            78.5%
          </p>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium relative z-10">
            Completion: 92%
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-xl shadow-blue-500/5 dark:shadow-none border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md overflow-hidden h-full transition-colors">
            <div className="px-6 py-5 border-b border-slate-200/60 dark:border-slate-800 flex justify-between items-center">
              <Typography
                variant="h2"
                className="text-slate-900 dark:text-white"
              >
                Upcoming Exams
              </Typography>
              <LinkButton
                href="/dashboard/exams"
                variant="secondary"
                className="text-xs px-3 py-1"
              >
                View All
              </LinkButton>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs font-medium tracking-wider uppercase">
                    <th className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-800">
                      Exam Name
                    </th>
                    <th className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-800">
                      Course
                    </th>
                    <th className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-800">
                      Scheduled Date
                    </th>
                    <th className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-800">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/60">
                  <tr className="hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        Algebra Final Exam
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Students enrolled: 11
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      Mathematics
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      <div>Oct 28, 2026, 10:00 AM</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        Duration: 120 mins
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                        Upcoming
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        Introduction to Biology
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Students enrolled: 6
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      Science
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      <div>Oct 29, 2026, 02:00 PM</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        Duration: 90 mins
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                        Published
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">
                        World History: Module 4
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Students enrolled: 3
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      History
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                      <div>Nov 02, 2026, 09:30 AM</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        Duration: 150 mins
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                        Pending Review
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-xl shadow-amber-500/5 dark:shadow-none border border-amber-200/60 dark:border-amber-900/40 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 h-full transition-colors">
            <Typography
              variant="h2"
              className="text-amber-800 dark:text-amber-400 mb-4 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Action Required
            </Typography>
            <div className="space-y-4">
              <div className="bg-white/80 dark:bg-slate-900/60 p-4 rounded-lg border border-amber-200/60 dark:border-amber-800/50 shadow-sm">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Missing Questions
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  "World History: Module 4" scheduled for Nov 2 has 0 questions
                  assigned.
                </p>
                <a
                  href="#"
                  className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 mt-2 inline-block transition-colors"
                >
                  Review Exam &rarr;
                </a>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/60 p-4 rounded-lg border border-amber-200/60 dark:border-amber-800/50 shadow-sm">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  Suspicious Incidents
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  3 participants were flagged for multiple browser exits in the
                  last 24 hours.
                </p>
                <a
                  href="#"
                  className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 mt-2 inline-block transition-colors"
                >
                  View Audit Logs &rarr;
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
