import Card from "@/shared-ui/component/Card";
import LinkButton from "@/shared-ui/component/LinkButton";
import Typography from "@/shared-ui/component/Typography";

export default function StudentDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/60 dark:border-slate-800 pb-4">
        <div>
          <Typography variant="h1" className="text-slate-900 dark:text-white">
            My Upcoming Exams
          </Typography>
          <Typography
            variant="subheading"
            className="mt-1 text-slate-500 dark:text-slate-400"
          >
            View and start your scheduled examinations below.
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg shadow-blue-500/5 dark:shadow-none border border-slate-200/60 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700/50 hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 transition-all duration-300 group">
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Introduction to Computer Science
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              (Code: CS101) - Faculty of Science
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-1">Date</p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">
                  Oct 26, 2026
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  10:00 AM
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-1">
                  Duration
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">
                  90 Mins
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-1">
                  Status
                </p>
                <span className="inline-flex items-center text-emerald-700 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 mr-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse"></span>
                  Open
                </span>
              </div>
            </div>

            <LinkButton
              href="/student/exams/attempt"
              variant="primary"
              className="w-full justify-center shadow-md shadow-blue-500/20 dark:shadow-none"
            >
              Start Attempt
            </LinkButton>
          </div>
        </Card>

        <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg shadow-blue-500/5 dark:shadow-none border border-slate-200/60 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700/50 hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 transition-all duration-300 group">
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Advanced Web Development
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              (Code: WD302) - Faculty of Technology
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-1">Date</p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">
                  Oct 28, 2026
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  11:30 AM
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-1">
                  Duration
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">
                  120 Mins
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-1">
                  Status
                </p>
                <span className="inline-flex items-center text-slate-700 dark:text-slate-400 font-medium">
                  Upcoming
                </span>
              </div>
            </div>

            <button
              disabled
              className="w-full bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 py-2 px-4 rounded-md font-medium cursor-not-allowed transition-colors"
            >
              Not Started
            </button>
          </div>
        </Card>

        <Card className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg shadow-blue-500/5 dark:shadow-none border border-slate-200/60 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700/50 hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20 transition-all duration-300 group">
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Data Structures & Algorithms
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              (Code: CS210) - Faculty of Science
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-1">Date</p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">
                  Oct 29, 2026
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  09:00 AM
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-1">
                  Duration
                </p>
                <p className="font-semibold text-slate-900 dark:text-slate-200">
                  105 Mins
                </p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 mb-1">
                  Status
                </p>
                <span className="inline-flex items-center text-slate-700 dark:text-slate-400 font-medium">
                  Upcoming
                </span>
              </div>
            </div>

            <button
              disabled
              className="w-full bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 py-2 px-4 rounded-md font-medium cursor-not-allowed transition-colors"
            >
              Not Started
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
