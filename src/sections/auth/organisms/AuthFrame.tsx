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
    <div className="grid min-h-screen grid-cols-1 gap-6 bg-white p-6 lg:grid-cols-2">
      <aside className="relative hidden min-h-125 overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d2a72] via-[#1d215f] to-[#17153f] p-8 lg:flex xl:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-950 to-blue-950" />
        <Logo className="pointer-events-none absolute bottom-0 left-0 h-auto w-full opacity-10" />
        <div className="relative z-10 flex w-full flex-col justify-between text-white">
          <h1 className="text-5xl font-bold leading-[1.05] tracking-[-2px] xl:text-6xl">
            Ujian yang terpercaya,
            <br />
            evaluasi yang berintegritas.
          </h1>
          <p className="ml-auto max-w-md text-sm leading-relaxed text-white/80">
            Kelola proses pembelajaran dan evaluasi secara aman, efisien, dan
            terpusat.
          </p>
        </div>
      </aside>
      <section className="grid min-h-195 grid-rows-[auto_1fr] gap-4">
        <div className="rounded-[28px] bg-[#9696f8] px-5 py-3 text-sm text-white">
          <RotatingQuote />
        </div>
        <div className="grid overflow-hidden rounded-4xl bg-[#f8f9fb] p-6">
          <div className="grid place-items-center overflow-y-auto">
            <div className="w-full max-w-md">
              <div className="mb-8 grid place-items-center">
                <Logo className="h-24 w-24" />
              </div>
              <div className="mb-8 text-center">
                <h2 className="text-4xl font-bold tracking-[-1px] text-[#2d3142]">
                  {title}
                </h2>
                <p className="mt-3 text-base leading-7 text-[#66739f]">
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
