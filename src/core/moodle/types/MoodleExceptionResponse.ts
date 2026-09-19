export interface MoodleExceptionResponse {
  readonly exception: string;
  readonly errorcode: string;
  readonly message: string;
  readonly debuginfo?: string;
}

export function isMoodleExceptionResponse(data: unknown): data is MoodleExceptionResponse {
  if (data === null || typeof data !== "object") {
    return false;
  }
  const candidate = data as Record<string, unknown>;
  return (
    typeof candidate.exception === "string" &&
    typeof candidate.errorcode === "string" &&
    typeof candidate.message === "string"
  );
}
