import { AppError } from "@/core/errors/AppError";
import { type ApiFailureResponse, ApiResponse } from "./ApiResponse";
import { HttpStatus } from "./HttpStatus";

export interface MappedHttpResponse {
  readonly status: number;
  readonly body: ApiFailureResponse;
}

export function mapErrorToHttpResponse(
  error: unknown,
  requestId?: string,
): MappedHttpResponse {
  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      body: ApiResponse.failure(
        error.code,
        error.message,
        error.details,
        requestId,
      ),
    };
  }

  // Unknown error sanitization: do not leak raw stack trace or internal message
  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    body: ApiResponse.failure(
      "INTERNAL_SERVER_ERROR",
      "Terjadi kesalahan pada server.",
      undefined,
      requestId,
    ),
  };
}
