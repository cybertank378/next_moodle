import clsx from "clsx";

export type StatAccent = "indigo" | "emerald" | "amber" | "rose";

const accentStyles: Record<StatAccent, { glow: string; dot: string }> = {
  indigo: {
    glow: "bg-indigo-500/10 dark:bg-indigo-400/10",
    dot: "bg-indigo-500 dark:bg-indigo-400",
  },
  emerald: {
    glow: "bg-emerald-500/10 dark:bg-emerald-400/10",
    dot: "bg-emerald-500 dark:bg-emerald-400",
  },
  amber: {
    glow: "bg-amber-500/10 dark:bg-amber-400/10",
    dot: "bg-amber-500 dark:bg-amber-400",
  },
  rose: {
    glow: "bg-rose-500/10 dark:bg-rose-400/10",
    dot: "bg-rose-500 dark:bg-rose-400",
  },
};

export function StatAccentGlow({ accent }: { accent: StatAccent }) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125",
        accentStyles[accent].glow,
      )}
    />
  );
}

export function StatAccentDot({ accent }: { accent: StatAccent }) {
  return (
    <span
      aria-hidden="true"
      className={clsx("inline-block h-2 w-2 rounded-full", accentStyles[accent].dot)}
    />
  );
}
