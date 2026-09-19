import type React from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: readonly SelectOption[];
}

export function SelectField({
  options,
  className,
  ...props
}: SelectFieldProps) {
  return (
    <select
      className={cn(
        "h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          className="bg-background text-foreground"
        >
          {opt.label}
        </option>
      ))}
    </select>
  );
}
