import clsx from "clsx";

export type StatAccent =
  | "indigo"
  | "emerald"
  | "amber"
  | "rose"
  | "blue"
  | "cyan"
  | "teal";

const accentStyles: Record<StatAccent, { glow: string; dot: string }> = {
  indigo: {
    glow: "bg-indigo-500/10 ",
    dot: "bg-indigo-500 ",
  },
  emerald: {
    glow: "bg-emerald-500/10 ",
    dot: "bg-emerald-500 ",
  },
  amber: {
    glow: "bg-amber-500/10 ",
    dot: "bg-amber-500 ",
  },
  rose: {
    glow: "bg-rose-500/10 ",
    dot: "bg-rose-500 ",
  },
  blue: {
    glow: "bg-blue-500/10 ",
    dot: "bg-blue-500 ",
  },
  cyan: {
    glow: "bg-cyan-500/10 ",
    dot: "bg-cyan-500 ",
  },
  teal: {
    glow: "bg-teal-500/10 ",
    dot: "bg-teal-500 ",
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
      className={clsx(
        "inline-block h-2 w-2 rounded-full",
        accentStyles[accent].dot,
      )}
    />
  );
}
