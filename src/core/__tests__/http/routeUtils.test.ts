import { describe, expect, it } from "vitest";
import { HttpStatus } from "@/core/http/HttpStatus";
import {
  forbiddenResponse,
  type RouteContext,
  type TenantRouteContext,
  unauthorizedResponse,
} from "@/core/http/routeUtils";

describe("routeUtils", () => {
  describe("unauthorizedResponse", () => {
    it("returns default 401 UNAUTHORIZED envelope", async () => {
      const res = unauthorizedResponse();
      const body = await res.json();

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("UNAUTHORIZED");
      expect(body.error.message).toBe("Sesi tidak valid atau telah berakhir.");
    });

    it("returns custom message when provided", async () => {
      const res = unauthorizedResponse("Token expired");
      const body = await res.json();

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(body.error.message).toBe("Token expired");
    });
  });

  describe("forbiddenResponse", () => {
    it("returns default 403 FORBIDDEN envelope", async () => {
      const res = forbiddenResponse();
      const body = await res.json();

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("FORBIDDEN");
      expect(body.error.message).toBe(
        "Anda tidak memiliki akses ke resource ini.",
      );
    });

    it("returns custom message when provided", async () => {
      const res = forbiddenResponse("Access denied");
      const body = await res.json();

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
      expect(body.error.message).toBe("Access denied");
    });
  });

  describe("RouteContext type helpers", () => {
    it("verifies type checking for RouteContext and TenantRouteContext", async () => {
      const tenantContext: TenantRouteContext = {
        params: Promise.resolve({ tenantId: "tenant-abc" }),
      };
      const params = await tenantContext.params;
      expect(params.tenantId).toBe("tenant-abc");

      const customContext: RouteContext<{ id: string }> = {
        params: Promise.resolve({ id: "123" }),
      };
      const customParams = await customContext.params;
      expect(customParams.id).toBe("123");
    });
  });
});
