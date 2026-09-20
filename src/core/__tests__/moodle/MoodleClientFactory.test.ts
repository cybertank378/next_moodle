import { describe, expect, it, vi } from "vitest";
import { InfrastructureError } from "@/core/errors/InfrastructureError";
import { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";
import type { TenantContext } from "@/core/tenant/TenantContext";

describe("MoodleClientFactory", () => {
  const tenantA: TenantContext = {
    tenantId: "tenant_a",
    slug: "tenant-a",
    status: "ACTIVE",
  };

  const tenantB: TenantContext = {
    tenantId: "tenant_b",
    slug: "tenant-b",
    status: "ACTIVE",
  };

  const fakeCredentialProvider: MoodleCredentialProvider = {
    getCredential: async (tenant) => {
      if (tenant.tenantId === "tenant_a") {
        return {
          baseUrl: "https://moodle-a.example.test",
          token: "TOKEN_ALPHA",
        };
      }
      if (tenant.tenantId === "tenant_b") {
        return {
          baseUrl: "https://moodle-b.example.test",
          token: "TOKEN_BETA",
        };
      }
      throw new Error(`Unknown tenant: ${tenant.tenantId}`);
    },
  };

  it("should resolve credentials and create client for tenant with requestId", async () => {
    const factory = new MoodleClientFactory(fakeCredentialProvider);

    const clientA = await factory.create({
      tenant: tenantA,
      requestId: "req-abc",
    });

    expect(clientA).toBeDefined();
    // Test that client operates with tenant A credentials
    let capturedBody = "";
    const mockFetcher = vi.fn().mockImplementation(async (_url, options) => {
      capturedBody = options.body;
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });

    // @ts-expect-error accessing private for testing isolation
    clientA.fetcher = mockFetcher;

    await clientA.call("core_webservice_get_site_info");
    const params = new URLSearchParams(capturedBody);
    expect(params.get("wstoken")).toBe("TOKEN_ALPHA");
  });

  it("should ensure tenant A/B isolation without shared mutable state", async () => {
    const factory = new MoodleClientFactory(fakeCredentialProvider);

    let capturedUrlA = "";
    let capturedBodyA = "";
    let capturedUrlB = "";
    let capturedBodyB = "";

    const clientA = await factory.create({
      tenant: tenantA,
      requestId: "req-a",
    });

    const clientB = await factory.create({
      tenant: tenantB,
      requestId: "req-b",
    });

    // @ts-expect-error accessing private for testing isolation
    clientA.fetcher = vi.fn().mockImplementation(async (url, opts) => {
      capturedUrlA = url;
      capturedBodyA = opts.body;
      return new Response(JSON.stringify({ tenant: "A" }), { status: 200 });
    });

    // @ts-expect-error accessing private for testing isolation
    clientB.fetcher = vi.fn().mockImplementation(async (url, opts) => {
      capturedUrlB = url;
      capturedBodyB = opts.body;
      return new Response(JSON.stringify({ tenant: "B" }), { status: 200 });
    });

    await clientA.call("fn_a");
    await clientB.call("fn_b");

    expect(capturedUrlA).toBe(
      "https://moodle-a.example.test/webservice/rest/server.php",
    );
    expect(capturedUrlB).toBe(
      "https://moodle-b.example.test/webservice/rest/server.php",
    );

    const paramsA = new URLSearchParams(capturedBodyA);
    const paramsB = new URLSearchParams(capturedBodyB);

    expect(paramsA.get("wstoken")).toBe("TOKEN_ALPHA");
    expect(paramsB.get("wstoken")).toBe("TOKEN_BETA");
  });

  it("should wrap provider failure into safe InfrastructureError", async () => {
    const failingProvider: MoodleCredentialProvider = {
      getCredential: async () => {
        throw new Error("Vault connection timeout");
      },
    };

    const factory = new MoodleClientFactory(failingProvider);

    await expect(
      factory.create({
        tenant: tenantA,
        requestId: "req-fail",
      }),
    ).rejects.toThrow(InfrastructureError);

    try {
      await factory.create({ tenant: tenantA });
    } catch (err) {
      expect(err).toBeInstanceOf(InfrastructureError);
      expect((err as InfrastructureError).message).toContain(
        "Failed to resolve credentials",
      );
    }
  });

  it("should maintain backward compatibility with getClientForTenant", async () => {
    const factory = new MoodleClientFactory(fakeCredentialProvider);
    const client = await factory.getClientForTenant(tenantA);
    expect(client).toBeDefined();
  });
});
