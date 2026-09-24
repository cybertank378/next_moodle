// Files: src/shared-ui/component/toastHandler.ts

import type { AppError } from "@/core/errors/AppError";
import { showErrorToast } from "@/shared-ui/component/Toast";

export function getErrorMessage(error?: unknown): string {
  if (!error) return "Terjadi kesalahan.";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Terjadi kesalahan tidak terduga.";
}

export const handleApiErrorToast = (error?: AppError | Error | unknown) => {
  const message = getErrorMessage(error);
  showErrorToast(message);
};
