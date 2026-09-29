// Files: src/shared-ui/component/SelectField.tsx

"use client";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { forwardRef, type ReactNode, type SelectHTMLAttributes } from "react";
import FormControl from "@/shared-ui/component/Form/FormControl";
import FormHelperText from "@/shared-ui/component/Form/FormHelperText";
import FormLabel from "@/shared-ui/component/Form/FormLabel";

type Variant = "outlined" | "filled" | "custom";
type Size = "lg" | "md" | "sm";

interface Props extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: ReactNode;
  helperText?: string;
  variant?: Variant;
  size?: Size;

  // Sama seperti TextField
  error?: boolean | string;

  success?: boolean;
  className?: string;
  wrapperClassName?: string;
}

const sizeMap: Record<Size, string> = {
  lg: "h-12 px-4 text-base",
  md: "h-11 px-3 text-sm",
  sm: "h-9 px-2 text-xs",
};

const variantMap: Record<Variant, string> = {
  outlined:
    "border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#151521]",
  filled: "border border-transparent bg-gray-100 dark:bg-slate-800",
  custom:
    "rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-[#151521]",
};

const SelectField = forwardRef<HTMLSelectElement, Props>(
  (
    {
      label,
      helperText,
      variant = "outlined",
      size = "md",
      error,
      success,
      className,
      wrapperClassName,
      children,
      disabled,
      name,
      ...props
    },
    ref,
  ) => {
    const externalErrorMessage = typeof error === "string" ? error : null;

    const finalError =
      typeof error === "boolean" ? error : Boolean(externalErrorMessage);

    return (
      <FormControl
        error={finalError}
        success={success}
        disabled={disabled}
        className={wrapperClassName}
      >
        {label && <FormLabel>{label}</FormLabel>}

        <div className="relative">
          <select
            ref={ref}
            name={name}
            data-field={name}
            disabled={disabled}
            className={clsx(
              "w-full appearance-none rounded-lg pr-10 text-gray-800 dark:text-slate-200 outline-none transition-all",
              sizeMap[size],
              variantMap[variant],
              finalError &&
                "border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900/40",
              success &&
                !finalError &&
                "border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900/40",
              !finalError &&
                !success &&
                "border-gray-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/40",
              disabled &&
                "cursor-not-allowed bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600",
              className,
            )}
            {...props}
          >
            {children}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-slate-400">
            <ChevronDown size={16} />
          </div>
        </div>

        <div className="mt-1 space-y-1">
          {externalErrorMessage && (
            <FormHelperText error>{externalErrorMessage}</FormHelperText>
          )}

          {!externalErrorMessage && helperText && (
            <FormHelperText success={success}>{helperText}</FormHelperText>
          )}
        </div>
      </FormControl>
    );
  },
);

SelectField.displayName = "SelectField";

export default SelectField;
