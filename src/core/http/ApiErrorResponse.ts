import type { HttpStatusCode } from "./HttpStatus";

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorResponseBody {
  success: false;
  error: ApiErrorDetail;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  status: HttpStatusCode;
  body: ApiErrorResponseBody;
}
