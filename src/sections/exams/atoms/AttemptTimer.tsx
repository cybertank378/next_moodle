"use client";

import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

export interface AttemptTimerProps {
  seconds: number;
  initialSeconds?: number;
  onTimeUp?: () => void;
  warningThresholdSeconds?: number;
  isPaused?: boolean;
  className?: string;
}

export function formatTimerDisplay(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}`;
}

export default function AttemptTimer({
  seconds: externalSeconds,
  initialSeconds,
  onTimeUp,
  warningThresholdSeconds = 300,
  isPaused = false,
  className = "",
}: AttemptTimerProps) {
  const [remaining, setRemaining] = useState<number>(
    initialSeconds ?? externalSeconds,
  );

  useEffect(() => {
    if (externalSeconds !== undefined) {
      setRemaining(externalSeconds);
    }
  }, [externalSeconds]);

  useEffect(() => {
    if (isPaused || remaining <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, onTimeUp, remaining]);

  const isWarning = remaining <= warningThresholdSeconds && remaining > 0;
  const isTimeUp = remaining <= 0;

  const warningClasses = isTimeUp
    ? "border-rose-500/40 bg-rose-500/10 text-rose-400 animate-pulse"
    : isWarning
      ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
      : "border-slate-800 bg-slate-900/80 text-white";

  return (
    <div
      data-testid="attempt-timer"
      data-warning={isWarning || isTimeUp ? "true" : "false"}
      className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-1.5 font-mono text-sm font-semibold tracking-wider transition-colors ${warningClasses} ${className}`}
    >
      <Clock
        size={16}
        className={isWarning || isTimeUp ? "text-amber-400" : "text-indigo-400"}
      />
      <span>{formatTimerDisplay(remaining)}</span>
    </div>
  );
}
