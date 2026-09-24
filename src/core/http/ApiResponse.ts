import type { ApiErrorDetail, ApiErrorResponseBody } from "./ApiErrorResponse";
import { HttpStatus, type HttpStatusCode } from "./HttpStatus";

export type { ApiErrorDetail, ApiErrorResponseBody };

export interface ApiSuccessResponseBody<T = unknown> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export type ApiResponseBody<T = unknown> =
  | ApiSuccessResponseBody<T>
  | ApiErrorResponseBody;

export class ApiResponse<T = unknown> {
  public readonly status: HttpStatusCode;
  public readonly body: ApiResponseBody<T>;

  private constructor(status: HttpStatusCode, body: ApiResponseBody<T>) {
    this.status = status;
    this.body = body;
  }

  public static success<U>(
    data: U,
    meta?: Record<string, unknown>,
    status: HttpStatusCode = HttpStatus.OK,
  ): ApiResponse<U> {
    const body: ApiSuccessResponseBody<U> = {
      success: true,
      data,
      ...(meta && { meta }),
    };
    return new ApiResponse<U>(status, body);
  }

  public static error(
    code: string,
    message: string,
    status: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    details?: unknown,
    meta?: Record<string, unknown>,
  ): ApiResponse<never> {
    const body: ApiErrorResponseBody = {
      success: false,
      error: {
        code,
        message,
        ...(details !== undefined && { details }),
      },
      ...(meta && { meta }),
    };
    return new ApiResponse<never>(status, body);
  }
}
