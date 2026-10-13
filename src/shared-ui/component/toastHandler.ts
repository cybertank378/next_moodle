// Files: src/shared-ui/component/toastHandler.ts

import type { AppError } from "@/core/errors/AppError";
import { showErrorToast } from "@/shared-ui/component/Toast";

export function getErrorMessage(error?: unknown): string {
  if (!error) return "Terjadi kesalahan.";
  let msg = "";
  if (typeof error === "string") {
    msg = error;
  } else if (error instanceof Error) {
    msg = error.message;
  } else if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    msg = String((error as { message: unknown }).message);
  } else {
    msg = "Terjadi kesalahan tidak terduga.";
  }

  if (msg.toLowerCase().includes("internal server error")) {
    return "Terjadi kendala pada sistem. Silakan coba beberapa saat lagi.";
  }
  return msg;
}

export const handleApiErrorToast = (error?: AppError | Error | unknown) => {
  const message = getErrorMessage(error);
  showErrorToast(message);
};
