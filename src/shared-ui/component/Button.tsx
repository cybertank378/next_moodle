// Files: src/shared-ui/component/Button.tsx

"use client";

import { Slot } from "@radix-ui/react-slot";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

//////////////////////////////////////////////////////////////
// TYPES
//////////////////////////////////////////////////////////////

type Variant =
  | "filled"
  | "label"
  | "outline"
  | "text"
  | "ghost"
  | "primary"
  | "secondary"
  | "danger";

type Size = "lg" | "md" | "sm";

type Shape = "rounded" | "circle";

type Color =
  | "primary"
  | "secondary"
  | "error"
  | "danger"
  | "warning"
  | "info"
  | "success";

//////////////////////////////////////////////////////////////
// PROPS
//////////////////////////////////////////////////////////////

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;

  variant?: Variant;

  size?: Size;

  color?: Color;

  leftIcon?: LucideIcon;

  rightIcon?: LucideIcon;

  loading?: boolean;

  iconOnly?: boolean;

  shape?: Shape;

  fullWidth?: boolean;

  asChild?: boolean;
}

//////////////////////////////////////////////////////////////
// BASE STYLES
//////////////////////////////////////////////////////////////
const baseStyles =
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
//////////////////////////////////////////////////////////////
// SIZE STYLES
//////////////////////////////////////////////////////////////

const sizeStyles: Record<Size, string> = {
  lg: "px-6 py-3 text-base",

  md: "px-4 py-2 text-sm",

  sm: "px-3 py-1.5 text-xs",
};

//////////////////////////////////////////////////////////////
// ICON ONLY SIZE
//////////////////////////////////////////////////////////////

const iconOnlySizeStyles: Record<Size, string> = {
  lg: "h-11 w-11 p-0",

  md: "h-10 w-10 p-0",

  sm: "h-9 w-9 p-0",
};

//////////////////////////////////////////////////////////////
// ICON SIZE
//////////////////////////////////////////////////////////////

const iconSizeMap: Record<Size, number> = {
  lg: 18,

  md: 16,

  sm: 14,
};

//////////////////////////////////////////////////////////////
// SHAPE
//////////////////////////////////////////////////////////////

const shapeStyles: Record<Shape, string> = {
  rounded: "rounded-lg",

  circle: "rounded-full aspect-square",
};

//////////////////////////////////////////////////////////////
// COLOR MAP
//////////////////////////////////////////////////////////////

const colorMap: Record<
  Color,
  Record<"filled" | "label" | "outline" | "text" | "ghost", string>
> = {
  primary: {
    filled:
      "bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 active:bg-indigo-800 focus:ring-indigo-400",
    label:
      "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 active:bg-indigo-300",
    outline:
      "border border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 active:bg-indigo-100",
    text: "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 active:bg-indigo-100",
    ghost:
      "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 active:bg-indigo-100",
  },

  secondary: {
    filled:
      "bg-slate-700 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 active:bg-slate-900 focus:ring-slate-400",
    label:
      "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300",
    outline:
      "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200",
    text: "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200",
    ghost:
      "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200",
  },

  error: {
    filled:
      "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-400",
    label:
      "bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 active:bg-red-300",
    outline:
      "border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 active:bg-red-100",
    text: "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 active:bg-red-100",
    ghost:
      "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 active:bg-red-100",
  },

  danger: {
    filled:
      "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus:ring-red-400",
    label:
      "bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 active:bg-red-300",
    outline:
      "border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 active:bg-red-100",
    text: "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 active:bg-red-100",
    ghost:
      "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 active:bg-red-100",
  },

  warning: {
    filled:
      "bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700 focus:ring-yellow-400",
    label:
      "bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/60 active:bg-yellow-300",
    outline:
      "border border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 active:bg-yellow-100",
    text: "text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 active:bg-yellow-100",
    ghost:
      "text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950/30 active:bg-yellow-100",
  },

  info: {
    filled:
      "bg-cyan-500 text-white hover:bg-cyan-600 active:bg-cyan-700 focus:ring-cyan-400",
    label:
      "bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-200 dark:hover:bg-cyan-900/60 active:bg-cyan-300",
    outline:
      "border border-cyan-500 text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 active:bg-cyan-100",
    text: "text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 active:bg-cyan-100",
    ghost:
      "text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 active:bg-cyan-100",
  },

  success: {
    filled:
      "bg-green-500 text-white hover:bg-green-600 active:bg-green-700 focus:ring-green-400",
    label:
      "bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/60 active:bg-green-300",
    outline:
      "border border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 active:bg-green-100",
    text: "text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 active:bg-green-100",
    ghost:
      "text-green-500 hover:bg-green-50 dark:hover:bg-green-950/30 active:bg-green-100",
  },
};

//////////////////////////////////////////////////////////////
// COMPONENT
//////////////////////////////////////////////////////////////

export default function Button({
  children,

  variant = "filled",

  size = "md",

  color = "primary",

  leftIcon: LeftIcon,

  rightIcon: RightIcon,

  loading = false,

  iconOnly = false,

  shape = "rounded",

  fullWidth = false,

  className,

  disabled,

  type = "button",

  asChild = false,

  ...props
}: Props) {
  //////////////////////////////////////////////////////////////
  // RESOLVE VARIANT & COLOR
  //////////////////////////////////////////////////////////////

  const resolvedColor: Color =
    variant === "primary"
      ? "primary"
      : variant === "secondary"
        ? "secondary"
        : variant === "danger"
          ? "danger"
          : color;

  const resolvedVariant =
    variant === "primary" || variant === "secondary" || variant === "danger"
      ? "filled"
      : variant;

  //////////////////////////////////////////////////////////////
  // COMPONENT
  //////////////////////////////////////////////////////////////

  const Comp = asChild ? Slot : "button";

  //////////////////////////////////////////////////////////////
  // ICON ONLY
  //////////////////////////////////////////////////////////////

  const isIconOnly = iconOnly || (!children && (LeftIcon || RightIcon));

  //////////////////////////////////////////////////////////////
  // ICON SIZE
  //////////////////////////////////////////////////////////////

  const iconSize = iconSizeMap[size];

  //////////////////////////////////////////////////////////////
  // RENDER
  //////////////////////////////////////////////////////////////

  return (
    <Comp
      {...(!asChild && {
        type,

        disabled: disabled || loading,
      })}
      className={clsx(
        baseStyles,

        shapeStyles[shape],

        isIconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],

        colorMap[resolvedColor][resolvedVariant],

        fullWidth && "w-full",

        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <span className="inline-flex items-center gap-2">
          {LeftIcon && <LeftIcon size={iconSize} />}

          {!isIconOnly && children}

          {RightIcon && <RightIcon size={iconSize} />}
        </span>
      )}
    </Comp>
  );
}
