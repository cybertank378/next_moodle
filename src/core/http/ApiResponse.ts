export interface ApiResponse<T = unknown> {
  readonly success: true;
  readonly data: T;
  readonly meta?: Readonly<Record<string, unknown>>;
}

export function createSuccessResponse<T>(
  data: T,
  meta?: Readonly<Record<string, unknown>>,
): ApiResponse<T> {
  return {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };
}
