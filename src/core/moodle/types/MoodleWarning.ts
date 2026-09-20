export interface MoodleWarning {
  readonly item?: string;
  readonly itemid?: number;
  readonly warningcode: string;
  readonly message: string;
}

export function isMoodleWarning(data: unknown): data is MoodleWarning {
  if (data === null || typeof data !== "object") {
    return false;
  }
  const candidate = data as Record<string, unknown>;
  return (
    typeof candidate.warningcode === "string" &&
    typeof candidate.message === "string"
  );
}
