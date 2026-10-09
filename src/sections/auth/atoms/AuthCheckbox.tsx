"use client";

import clsx from "clsx";
import type { ReactNode } from "react";

interface Props {
  readonly label: ReactNode;
  readonly checked: boolean;
  readonly onChangeAction: (checked: boolean) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

export default function AuthCheckbox({
  label,
  checked,
  onChangeAction,
  disabled = false,
  className,
}: Props) {
  return (
    <label
      className={clsx(
        "inline-flex items-center gap-3 text-sm text-gray-700 transition",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        className,
      )}
    >
      <input
        checked={checked}
        className="peer sr-only"
        disabled={disabled}
        onChange={(event) => onChangeAction(event.target.checked)}
        type="checkbox"
      />
      <span
        className={clsx(
          "flex h-4 w-4 items-center justify-center rounded border transition-all peer-focus:ring-2 peer-focus:ring-emerald-200",
          checked
            ? "border-emerald-500 bg-emerald-500"
            : "border-gray-300 bg-white",
        )}
      >
        {checked ? (
          <span aria-hidden="true" className="text-xs leading-none text-white">
            ✓
          </span>
        ) : null}
      </span>
      <span>{label}</span>
    </label>
  );
}
