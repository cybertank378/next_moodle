// Files: src/sections/auth/molecules/LoginFormFields.tsx

import { Lock, User } from "lucide-react";
import AuthTextField from "@/sections/auth/atoms/AuthTextField";

export interface LoginFormFieldsProps {
  readonly identifier: string;
  readonly password: string;
  readonly identifierError?: string;
  readonly passwordError?: string;
  readonly submitted: boolean;
  readonly disabled?: boolean;
  readonly onChangeIdentifier: (value: string) => void;
  readonly onChangePassword: (value: string) => void;
}

export default function LoginFormFields({
  identifier,
  password,
  identifierError,
  passwordError,
  submitted,
  disabled = false,
  onChangeIdentifier,
  onChangePassword,
}: LoginFormFieldsProps) {
  return (
    <div className="space-y-4">
      <AuthTextField
        autoComplete="username"
        disabled={disabled}
        error={identifierError}
        id="username"
        label="Username"
        leftIcon={User}
        name="username"
        onChangeAction={onChangeIdentifier}
        placeholder="Masukkan username Anda"
        required
        touched={submitted}
        value={identifier}
      />
      <AuthTextField
        autoComplete="current-password"
        disabled={disabled}
        error={passwordError}
        id="password"
        label="Kata Sandi"
        leftIcon={Lock}
        name="password"
        onChangeAction={onChangePassword}
        placeholder="Masukkan kata sandi Anda"
        required
        touched={submitted}
        type="password"
        value={password}
      />
    </div>
  );
}
