import {
  type ApiErrorDetail,
  type ApiFailureResponse,
  createErrorResponse,
} from "./ApiResponse";

export type { ApiErrorDetail, ApiFailureResponse };
export type ApiErrorResponse = ApiFailureResponse;
export { createErrorResponse };
