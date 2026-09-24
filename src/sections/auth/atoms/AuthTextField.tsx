"use client";

import { CheckCircle, type LucideIcon } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";
import TextField from "@/shared-ui/component/TextField";

interface Props
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onBlur" | "onChange" | "type" | "value"
  > {
  readonly label: ReactNode;
  readonly type?: "email" | "number" | "password" | "text";
  readonly value: string;
  readonly onChangeAction: (value: string) => void;
  readonly onBlurAction?: () => void;
  readonly error?: string;
  readonly touched?: boolean;
  readonly showValid?: boolean;
  readonly leftIcon?: LucideIcon;
  readonly rightIcon?: LucideIcon;
  readonly onRightIconClickAction?: () => void;
}

export default function AuthTextField({
  label,
  type = "text",
  value,
  onChangeAction,
  onBlurAction,
  error,
  touched,
  showValid,
  required,
  leftIcon,
  rightIcon,
  onRightIconClickAction,
  ...inputProps
}: Props) {
  const isError = Boolean(error && touched);
  const isValid = Boolean(showValid && !isError && value.length > 0);
  return (
    <TextField
      {...inputProps}
      enablePasswordToggle={type === "password"}
      error={isError}
      helperText={isError ? error : undefined}
      label={
        required ? (
          <>
            {label}
            <span className="text-red-500"> *</span>
          </>
        ) : (
          label
        )
      }
      leftIcon={leftIcon}
      onBlur={onBlurAction}
      onChange={(event) => onChangeAction(event.target.value)}
      onRightIconClick={onRightIconClickAction}
      rightIcon={isValid ? CheckCircle : rightIcon}
      size="lg"
      success={isValid}
      type={type}
      value={value}
      variant="custom"
    />
  );
}
