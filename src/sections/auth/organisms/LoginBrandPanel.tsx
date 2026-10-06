// Files: src/sections/auth/organisms/LoginBrandPanel.tsx

import clsx from "clsx";
import Image from "next/image";
import AuthBrand from "@/sections/auth/atoms/AuthBrand";
import LoginFeatureRow from "@/sections/auth/molecules/LoginFeatureRow";

export interface LoginBrandPanelProps {
  readonly className?: string;
}

export default function LoginBrandPanel({ className }: LoginBrandPanelProps) {
  return (
    <aside
      aria-label="Informasi Platform EduNusa"
      className={clsx(
        "relative flex h-full w-full flex-col justify-between overflow-hidden p-8 lg:p-12 xl:p-16",
        "bg-gradient-to-br from-[#0B1528] via-[#0E1F3D] to-[#081020] text-white",
        className,
      )}
    >
      {/* Decorative ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] opacity-5 [background-size:24px_24px]"
      />

      {/* Brand header */}
      <div className="relative z-10">
        <AuthBrand size="lg" variant="light" />
      </div>

      {/* Main copy and illustration */}
      <div className="relative z-10 my-auto flex flex-col justify-center py-6">
        <div className="max-w-xl">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl xl:text-5xl leading-[1.15]">
            Belajar lebih terarah.
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-sky-300 to-indigo-200 bg-clip-text text-transparent">
              Kelola pendidikan lebih mudah.
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-slate-300">
            Satu tempat untuk pembelajaran, ujian, dan pengelolaan sekolah.
          </p>
        </div>

        {/* Educational illustration */}
        <div className="relative my-6 flex w-full items-center justify-center">
          <div className="relative aspect-4/3 w-full max-w-[440px] xl:max-w-[480px]">
            <Image
              alt=""
              aria-hidden="true"
              className="object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
              fill
              priority
              sizes="(min-width: 1280px) 480px, (min-width: 1024px) 440px, 100vw"
              src="/assets/images/auth/book-and-schools.png"
            />
          </div>
        </div>
      </div>

      {/* Feature pills row */}
      <div className="relative z-10 pt-4">
        <LoginFeatureRow />
      </div>
    </aside>
  );
}
