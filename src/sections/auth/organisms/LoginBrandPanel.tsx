// Files: src/sections/auth/organisms/LoginBrandPanel.tsx

import clsx from "clsx";
import Image from "next/image";
import { APP_NAME } from "@/libs/branding";
import AuthBrand from "@/sections/auth/atoms/AuthBrand";
import LoginFeatureRow from "@/sections/auth/molecules/LoginFeatureRow";

export interface LoginBrandPanelProps {
  readonly className?: string;
}

export default function LoginBrandPanel({ className }: LoginBrandPanelProps) {
  return (
    <aside
      aria-label={`Informasi Platform ${APP_NAME}`}
      className={clsx(
        "relative flex h-full w-full flex-col justify-between overflow-hidden p-8 lg:p-12 xl:p-14",
        "bg-gradient-to-br from-[#061743] via-[#0A266F] to-[#041235] text-white",
        className,
      )}
    >
      {/* Decorative ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-blue-400/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl"
      />

      {/* Brand header */}
      <div className="relative z-10">
        <AuthBrand preload size="lg" surfaceTone="dark" />
      </div>

      {/* Main copy and illustration */}
      <div className="relative z-10 my-auto flex flex-col justify-center py-4">
        <div className="max-w-xl">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl xl:text-[40px] leading-[1.2] text-white">
            Belajar lebih terarah.
            <br />
            Kelola pendidikan lebih mudah.
          </h1>
          <p className="mt-3 max-w-lg text-sm sm:text-base leading-relaxed text-blue-100/80">
            Satu tempat untuk pembelajaran, ujian, dan pengelolaan sekolah.
          </p>
        </div>

        {/* Central visual composition: 3D Illustration + Floating Mobile Mockup Preview */}
        <div className="relative my-4 flex w-full items-center justify-center">
          {/* Floating Mobile Preview with pill badge matching mockup */}
          <div className="hidden xl:flex flex-col items-center absolute -left-2 bottom-2 z-20 w-36 drop-shadow-2xl">
            <span className="mb-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/90 border border-blue-400/40 text-white text-[10px] font-semibold tracking-wide shadow-sm">
              Mobile
            </span>
            <div className="relative aspect-[720/1381] w-full">
              <Image
                alt=""
                aria-hidden="true"
                className="object-contain drop-shadow-2xl"
                fill
                sizes="144px"
                src="/assets/images/ilustrator/mobile-mockup.png"
              />
            </div>
          </div>

          {/* Main 3D Book & Schools Illustration */}
          <div className="relative aspect-[16/10] w-full max-w-[500px] xl:max-w-[560px]">
            <Image
              alt=""
              aria-hidden="true"
              className="object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.01]"
              fill
              priority
              sizes="(min-width: 1280px) 560px, (min-width: 1024px) 500px, 100vw"
              src="/assets/images/ilustrator/book-and-schools.png"
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
