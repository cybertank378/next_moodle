import type { MoodleRequestParameters } from "./types/MoodleRequestParameters";

// biome-ignore lint/complexity/noStaticOnlyClass: utility class for request encoding
export class MoodleRequestEncoder {
  public static encode(
    params?: MoodleRequestParameters | Record<string, unknown>,
  ): URLSearchParams {
    const searchParams = new URLSearchParams();

    if (!params || typeof params !== "object") {
      return searchParams;
    }

    function append(data: unknown, currentPrefix: string): void {
      if (data === null || data === undefined) {
        return;
      }

      if (typeof data === "boolean") {
        searchParams.append(currentPrefix, data ? "1" : "0");
        return;
      }

      if (typeof data === "object") {
        if (Array.isArray(data)) {
          for (let i = 0; i < data.length; i++) {
            append(data[i], `${currentPrefix}[${i}]`);
          }
        } else {
          for (const [key, val] of Object.entries(
            data as Record<string, unknown>,
          )) {
            const newPrefix = currentPrefix ? `${currentPrefix}[${key}]` : key;
            append(val, newPrefix);
          }
        }
      } else {
        searchParams.append(currentPrefix, String(data));
      }
    }

    append(params, "");
    return searchParams;
  }
}

export function encodeMoodleParams(
  params?: MoodleRequestParameters | Record<string, unknown>,
): URLSearchParams {
  return MoodleRequestEncoder.encode(params);
}
