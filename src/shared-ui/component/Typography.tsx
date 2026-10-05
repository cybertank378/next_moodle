// File: src/shared-ui/component/Typography.tsx

import clsx from "clsx";
import type { ElementType, HTMLAttributes, ReactNode } from "react";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subheading"
  | "body"
  | "caption";

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<TypographyVariant, string> = {
  h1: "text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 ",
  h2: "text-xl md:text-2xl font-bold tracking-tight text-slate-900 ",
  h3: "text-lg md:text-xl font-semibold text-slate-900 ",
  h4: "text-base md:text-lg font-semibold text-slate-900 ",
  h5: "text-sm md:text-base font-semibold text-slate-900 ",
  h6: "text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-900 ",
  subheading: "text-sm font-medium text-slate-500 ",
  body: "text-sm text-slate-600  leading-relaxed",
  caption: "text-xs text-slate-400 ",
};

const defaultTagMap: Record<TypographyVariant, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  subheading: "p",
  body: "p",
  caption: "span",
};

export default function Typography({
  variant = "body",
  as,
  children,
  className,
  ...props
}: TypographyProps) {
  const Component = as ?? defaultTagMap[variant];

  return (
    <Component className={clsx(variantStyles[variant], className)} {...props}>
      {children}
    </Component>
  );
}
