import { beforeEach, describe, expect, it, vi } from "vitest";
import { request } from "@/libs/apiClient";

describe("apiClient — reusable client request utility", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns data and null error on success", async () => {
    const mockData = { id: "123", name: "Tenant A" };
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockData,
      }),
    } as Response);

    const result = await request<typeof mockData>("/api/tenant");

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeNull();
  });

  it("returns error message when API responds with success: false", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: false,
        error: { message: "Data tidak ditemukan." },
      }),
    } as Response);

    const result = await request("/api/tenant/invalid");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Data tidak ditemukan.");
  });

  it("returns fallback error message when response is not ok", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
      }),
    } as Response);

    const result = await request("/api/tenant");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Permintaan gagal.");
  });

  it("catches network or fetch exceptions safely", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
      new Error("Network connection lost"),
    );

    const result = await request("/api/tenant");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Network connection lost");
  });
});
