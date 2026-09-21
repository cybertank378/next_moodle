import { AppError } from "../errors/AppError";
import { ApiResponse } from "./ApiResponse";
import { HttpStatus, type HttpStatusCode } from "./HttpStatus";

export function mapErrorToHttpResponse(
  error: unknown,
  requestId?: string,
): ApiResponse<never> {
  const meta = requestId ? { requestId } : undefined;

  if (error instanceof AppError) {
    return ApiResponse.error(
      error.code,
      error.message,
      error.statusCode as HttpStatusCode,
      error.details,
      meta,
    );
  }

  // Fallback for unknown / native errors — never leak raw stack or internal message
  return ApiResponse.error(
    "INTERNAL_ERROR",
    "Internal server error",
    HttpStatus.INTERNAL_SERVER_ERROR,
    undefined,
    meta,
  );
}
