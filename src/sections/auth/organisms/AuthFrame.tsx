import type { ReactNode } from "react";
import { Logo } from "@/shared-ui/component/Icons";
import RotatingQuote from "@/shared-ui/component/RotatingQuote";

interface Props {
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
}

export default function AuthFrame({ title, description, children }: Props) {
  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 bg-white dark:bg-slate-950 p-6 lg:grid-cols-2 transition-colors duration-500">
      <aside className="relative hidden min-h-125 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-blue-800 to-indigo-900 dark:from-indigo-950 dark:via-slate-900 dark:to-indigo-950 p-8 lg:flex xl:p-12 shadow-xl shadow-blue-900/20 dark:shadow-none">
        <div className="absolute inset-0 bg-[url('/images/ilustrator/noise.png')] opacity-20 mix-blend-overlay"></div>
        <Logo className="pointer-events-none absolute bottom-0 left-0 h-auto w-full opacity-10 dark:opacity-5" />
        <div className="relative z-10 flex w-full flex-col justify-between text-white">
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight xl:text-6xl drop-shadow-sm">
            Ujian yang terpercaya,
            <br />
            evaluasi yang berintegritas.
          </h1>
          <p className="ml-auto max-w-md text-sm leading-relaxed text-indigo-100 dark:text-slate-300">
            Kelola proses pembelajaran dan evaluasi secara aman, efisien, dan
            terpusat.
          </p>
        </div>
      </aside>
      <section className="grid min-h-195 grid-rows-[auto_1fr] gap-4">
        <div className="rounded-[28px] bg-indigo-500 dark:bg-indigo-900/40 border border-indigo-400/30 dark:border-indigo-500/20 px-5 py-3 text-sm text-white shadow-sm backdrop-blur-sm">
          <RotatingQuote />
        </div>
        <div className="grid overflow-hidden rounded-4xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60 backdrop-blur-xl p-6 shadow-2xl shadow-slate-200/50 dark:shadow-none transition-all">
          <div className="grid place-items-center overflow-y-auto">
            <div className="w-full max-w-md">
              <div className="mb-8 grid place-items-center">
                <Logo className="h-24 w-24 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {title}
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">
                  {description}
                </p>
              </div>
              {children}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
