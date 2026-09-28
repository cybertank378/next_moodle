export interface RequestState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { message?: string };
}

export async function request<T>(
  url: string,
  options?: RequestInit,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    const body = (await response.json()) as ApiEnvelope<T>;
    if (!response.ok || !body.success || body.data === undefined) {
      return { data: null, error: body.error?.message ?? "Permintaan gagal." };
    }
    return { data: body.data, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Permintaan gagal.";
    return { data: null, error: message };
  }
}
