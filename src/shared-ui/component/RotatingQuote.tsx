//Files: src/shared-ui/component/RotatingQuote.tsx
"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { QUOTES } from "@/sections/auth/atoms/quotes";

export default function RotatingQuote() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % QUOTES.length);
        setAnimate(true);
      }, 200); // delay fade out → in
    }, 4000); // ganti quote tiap 4 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[56px] flex items-center justify-center text-center">
      <p
        className={clsx(
          "text-sm text-white transition-all duration-500",
          animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2",
        )}
      >
        “{QUOTES[index]}”
      </p>
    </div>
  );
}
