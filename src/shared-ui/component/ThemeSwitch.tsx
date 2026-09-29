// Files: src/shared-ui/component/ThemeSwitch.tsx
"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

export interface ThemeSwitchProps {
  checked?: boolean;
  onChange?: (isDark: boolean) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  ariaLabel?: string;
}

export default function ThemeSwitch({
  checked: controlledChecked,
  onChange,
  className,
  size = "md",
  ariaLabel = "Ubah tema terang atau gelap",
}: ThemeSwitchProps) {
  const [internalDark, setInternalDark] = useState(false);

  const isControlled = controlledChecked !== undefined;
  const isDark = isControlled ? controlledChecked : internalDark;

  // Initialize theme from DOM or localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const docIsDark = document.documentElement.classList.contains("dark");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    const initialDark =
      savedTheme === "dark" ||
      (!savedTheme && (docIsDark || systemPrefersDark));

    if (!isControlled) {
      setInternalDark(initialDark);
    }

    if (initialDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isControlled]);

  const handleToggle = () => {
    const nextDark = !isDark;

    if (!isControlled) {
      setInternalDark(nextDark);
    }

    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    onChange?.(nextDark);
  };

  // Dimensions based on size prop
  const dimensions = {
    sm: {
      width: "w-[54px]",
      height: "h-[28px]",
      thumbSize: "w-[22px] h-[22px]",
      translate: "translate-x-[26px]",
      initialOffset: "translate-x-[3px]",
      moonCrater1: "w-[5px] h-[5px] top-[3px] left-[4px]",
      moonCrater2: "w-[3.5px] h-[3.5px] top-[11px] left-[3px]",
      moonCrater3: "w-[7px] h-[7px] top-[7px] left-[11px]",
    },
    md: {
      width: "w-[66px]",
      height: "h-[34px]",
      thumbSize: "w-[26px] h-[26px]",
      translate: "translate-x-[32px]",
      initialOffset: "translate-x-[4px]",
      moonCrater1: "w-[6.5px] h-[6.5px] top-[4px] left-[5px]",
      moonCrater2: "w-[4.5px] h-[4.5px] top-[13px] left-[4px]",
      moonCrater3: "w-[8.5px] h-[8.5px] top-[8px] left-[13px]",
    },
    lg: {
      width: "w-[78px]",
      height: "h-[40px]",
      thumbSize: "w-[32px] h-[32px]",
      translate: "translate-x-[38px]",
      initialOffset: "translate-x-[4px]",
      moonCrater1: "w-[8px] h-[8px] top-[5px] left-[6px]",
      moonCrater2: "w-[5.5px] h-[5.5px] top-[16px] left-[5px]",
      moonCrater3: "w-[10.5px] h-[10.5px] top-[10px] left-[16px]",
    },
  }[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={ariaLabel}
      title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
      onClick={handleToggle}
      className={clsx(
        "relative inline-flex items-center rounded-full overflow-hidden select-none cursor-pointer transition-colors duration-500 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500",
        dimensions.width,
        dimensions.height,
        // Track background: Sky Blue (#0076F6) for Sun / Dark Navy (#24282F) for Moon
        isDark
          ? "bg-[#24282F] border border-slate-700/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
          : "bg-gradient-to-r from-[#0076F6] to-[#2B8EFF] border border-blue-400/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]",
        className,
      )}
    >
      {/* ================= BACKGROUND ELEMENTS ================= */}

      {/* 1. CLOUDS (Visible in Light Mode, placed on right side) */}
      <div
        className={clsx(
          "absolute right-0 bottom-0 pointer-events-none transition-all duration-500 ease-in-out",
          isDark
            ? "opacity-0 translate-y-3 pointer-events-none"
            : "opacity-100 translate-y-0",
        )}
      >
        <svg
          viewBox="0 0 54 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-6 overflow-visible"
          aria-hidden="true"
        >
          <title>Awan Mode Terang</title>
          {/* Back cloud layer with opacity */}
          <path
            d="M20 22C20 18.5 22.8 15.6 26.3 15.6C27.2 15.6 28 15.8 28.7 16.2C30 13.7 32.6 12 35.6 12C39.8 12 43.3 15.1 43.8 19.2C44.5 19.1 45.2 19 46 19C49.9 19 53 22.1 53 26C53 26.7 52.9 27.4 52.7 28H19.2C19.7 26.2 20 24.2 20 22Z"
            fill="#D4EAFE"
            fillOpacity="0.75"
          />
          {/* Front fluffy cloud layer */}
          <path
            d="M8 28C8.5 24 11.8 20.8 16 20.8C17 20.8 18 21 18.9 21.5C20.3 17.5 24.1 14.5 28.7 14.5C34.2 14.5 38.8 18.6 39.5 24C40.4 23.9 41.4 23.8 42.4 23.8C47.1 23.8 51 27.7 51 32.4C51 32.6 51 32.8 51 33H7C7.3 31.3 7.6 29.6 8 28Z"
            fill="#FFFFFF"
          />
          {/* Bottom cloud curve */}
          <circle cx="28" cy="24" r="9" fill="#FFFFFF" />
          <circle cx="17" cy="26" r="7" fill="#FFFFFF" />
          <circle cx="40" cy="27" r="7.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* 2. STARS (Visible in Dark Mode, placed on left side) */}
      <div
        className={clsx(
          "absolute left-2.5 top-0 bottom-0 flex items-center pointer-events-none transition-all duration-500 ease-in-out",
          isDark
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none",
        )}
      >
        <svg
          viewBox="0 0 32 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-5 overflow-visible"
          aria-hidden="true"
        >
          <title>Bintang Mode Gelap</title>
          {/* Star 1 (Big Sparkle) */}
          <path
            d="M6 3L6.8 5.2L9 6L6.8 6.8L6 9L5.2 6.8L3 6L5.2 5.2L6 3Z"
            fill="#FFFFFF"
          />
          {/* Star 2 (Small Dot) */}
          <circle cx="15" cy="5" r="1" fill="#FFFFFF" />
          {/* Star 3 (Tiny Dot) */}
          <circle cx="7" cy="15" r="1.2" fill="#FFFFFF" />
          {/* Star 4 (Medium Sparkle) */}
          <path
            d="M17 14L17.5 15.5L19 16L17.5 16.5L17 18L16.5 16.5L15 16L16.5 15.5L17 14Z"
            fill="#FFFFFF"
          />
          {/* Star 5 (Tiny Dot) */}
          <circle cx="22" cy="8" r="0.8" fill="#FFFFFF" fillOpacity="0.8" />
          {/* Star 6 (Tiny Dot) */}
          <circle cx="12" cy="19" r="0.9" fill="#FFFFFF" fillOpacity="0.9" />
        </svg>
      </div>

      {/* ================= KNOB / THUMB (SUN OR MOON) ================= */}
      <div
        className={clsx(
          "relative rounded-full transition-all duration-500 ease-out shadow-md flex items-center justify-center overflow-hidden",
          dimensions.thumbSize,
          isDark ? dimensions.translate : dimensions.initialOffset,
          // Color: Sun is #ECC635 (Yellow), Moon is #D9D9D9 (Grey)
          isDark
            ? "bg-[#D9D9D9] shadow-[0_2px_6px_rgba(0,0,0,0.4)] border border-slate-300"
            : "bg-[#ECC635] shadow-[0_2px_8px_rgba(236,198,53,0.55)] border border-amber-200/60",
        )}
      >
        {/* SUN DETAILS: Warm soft inner glow */}
        <div
          className={clsx(
            "absolute inset-0 rounded-full transition-opacity duration-500",
            isDark
              ? "opacity-0"
              : "opacity-100 bg-gradient-to-tr from-[#ECC635] to-[#F7DC6F]",
          )}
        />

        {/* MOON DETAILS: 3 Craters with #9B9B9B grey color */}
        <div
          className={clsx(
            "absolute inset-0 rounded-full transition-opacity duration-500 pointer-events-none",
            isDark ? "opacity-100" : "opacity-0",
          )}
        >
          {/* Crater 1 (Top-Left) */}
          <span
            className={clsx(
              "absolute rounded-full bg-[#9B9B9B] shadow-[inset_0.5px_0.5px_1px_rgba(0,0,0,0.3)]",
              dimensions.moonCrater1,
            )}
          />
          {/* Crater 2 (Bottom-Left) */}
          <span
            className={clsx(
              "absolute rounded-full bg-[#9B9B9B] shadow-[inset_0.5px_0.5px_1px_rgba(0,0,0,0.3)]",
              dimensions.moonCrater2,
            )}
          />
          {/* Crater 3 (Right) */}
          <span
            className={clsx(
              "absolute rounded-full bg-[#9B9B9B] shadow-[inset_0.5px_0.5px_1px_rgba(0,0,0,0.3)]",
              dimensions.moonCrater3,
            )}
          />
        </div>
      </div>
    </button>
  );
}
