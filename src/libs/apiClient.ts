export interface RequestState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { code?: string; message?: string };
}

export async function request<T>(
  url: string,
  options?: RequestInit,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    const body = (await response.json()) as ApiEnvelope<T>;

    if (response.status === 401 || body.error?.code === "UNAUTHORIZED") {
      if (typeof window !== "undefined") {
        console.error("apiClient.ts intercepted 401. URL:", url);
        window.location.href = "/login";
      }
      return { data: null, error: body.error?.message ?? "Sesi tidak valid." };
    }

    if (!response.ok || !body.success || body.data === undefined) {
      let errorMsg = body.error?.message ?? "Permintaan gagal.";
      if (errorMsg.toLowerCase().includes("internal server error")) {
        errorMsg = "Terjadi kendala pada sistem. Silakan coba beberapa saat lagi.";
      }
      return { data: null, error: errorMsg };
    }
    return { data: body.data, error: null };
  } catch (err) {
    let message = err instanceof Error ? err.message : "Permintaan gagal.";
    if (message.toLowerCase().includes("internal server error")) {
      message = "Terjadi kendala pada sistem. Silakan coba beberapa saat lagi.";
    }
    return { data: null, error: message };
  }
}
