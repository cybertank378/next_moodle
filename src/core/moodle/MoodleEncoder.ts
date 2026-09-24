export function encodeMoodleParams(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  function appendParam(prefix: string, value: unknown): void {
    if (value === null || value === undefined) {
      return;
    }

    if (typeof value === "boolean") {
      searchParams.append(prefix, value ? "1" : "0");
      return;
    }

    if (typeof value === "object") {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          appendParam(`${prefix}[${index}]`, item);
        });
      } else {
        for (const [subKey, subVal] of Object.entries(
          value as Record<string, unknown>,
        )) {
          appendParam(`${prefix}[${subKey}]`, subVal);
        }
      }
      return;
    }

    searchParams.append(prefix, String(value));
  }

  for (const [key, value] of Object.entries(params)) {
    appendParam(key, value);
  }

  return searchParams.toString();
}
