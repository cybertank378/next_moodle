export interface ApiErrorDetail {
  readonly code: string;
  readonly message: string;
  readonly details?: unknown;
}

export interface ApiSuccessResponse<T = unknown, M = Record<string, unknown>> {
  readonly success: true;
  readonly data: T;
  readonly meta?: M;
}

export interface ApiFailureResponse {
  readonly success: false;
  readonly error: ApiErrorDetail;
  readonly requestId?: string;
}

export type ApiResponse<T = unknown, M = Record<string, unknown>> =
  | ApiSuccessResponse<T, M>
  | ApiFailureResponse;

export const ApiResponse = {
  success<T, M = Record<string, unknown>>(
    data: T,
    meta?: M,
  ): ApiSuccessResponse<T, M> {
    return {
      success: true,
      data,
      ...(meta ? { meta } : {}),
    };
  },

  failure(
    code: string,
    message: string,
    details?: unknown,
    requestId?: string,
  ): ApiFailureResponse {
    return {
      success: false,
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
      ...(requestId ? { requestId } : {}),
    };
  },
};

export function createSuccessResponse<T, M = Record<string, unknown>>(
  data: T,
  meta?: M,
): ApiSuccessResponse<T, M> {
  return ApiResponse.success(data, meta);
}

export function createErrorResponse(
  code: string,
  message: string,
  details?: unknown,
  requestId?: string,
): ApiFailureResponse {
  return ApiResponse.failure(code, message, details, requestId);
}
