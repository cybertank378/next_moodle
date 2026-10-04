import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";

vi.mock("@/modules/auth/server/getCurrentUser", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/app/api/tenant/_factory", () => {
  const mockController = {
    list: vi.fn(),
    create: vi.fn(),
    getOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    configureCredentials: vi.fn(),
  };
  return {
    getTenantsController: () => mockController,
  };
});

import { NextResponse } from "next/server";
import { getTenantsController } from "@/app/api/tenant/_factory";
import { PUT as configureCredentials } from "@/app/api/tenant/[tenantId]/credentials/route";
import {
  DELETE as deleteTenant,
  GET as getTenantById,
  PATCH as updateTenant,
} from "@/app/api/tenant/[tenantId]/route";
import {
  POST as createTenant,
  GET as getTenants,
} from "@/app/api/tenant/route";
import { ApiResponse } from "@/core/http/ApiResponse";
import { HttpStatus } from "@/core/http/HttpStatus";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

describe("Tenant API Routes & RBAC protection", () => {
  const mockController = getTenantsController();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/tenant", () => {
    it("returns 401 UNAUTHORIZED when no actor session exists", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce(null);

      const req = new NextRequest("http://localhost:3000/api/tenant");
      const res = await getTenants(req);
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("UNAUTHORIZED");
      expect(mockController.list).not.toHaveBeenCalled();
    });

    it("returns 403 FORBIDDEN when accessed by a STUDENT session", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce({
        userId: "student-1",
        username: "student01",
        role: AppRole.STUDENT,
        tenantId: "tenant-1",
      });

      vi.mocked(mockController.list).mockResolvedValueOnce(
        NextResponse.json(
          ApiResponse.error(
            "FORBIDDEN",
            "Akses ditolak: role STUDENT tidak memiliki permission tenant.read",
            HttpStatus.FORBIDDEN,
          ).body,
          { status: HttpStatus.FORBIDDEN },
        ),
      );

      const req = new NextRequest("http://localhost:3000/api/tenant");
      const res = await getTenants(req);
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("FORBIDDEN");
      expect(mockController.list).toHaveBeenCalled();
    });

    it("returns 200 OK with tenants data when accessed by an ADMIN session", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce({
        userId: "admin-1",
        username: "admin01",
        role: AppRole.ADMIN,
        tenantId: "",
      });

      vi.mocked(mockController.list).mockResolvedValueOnce(
        NextResponse.json(
          ApiResponse.success(
            {
              tenants: [
                {
                  id: "tenant-1",
                  name: "Tenant Alpha",
                  slug: "tenant-alpha",
                  status: "ACTIVE",
                  hasMoodleCredential: true,
                  hasBranding: false,
                  customDomain: "alpha.example.com",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
              total: 1,
              page: 1,
              pageSize: 10,
            },
            { total: 1, page: 1, pageSize: 10 },
          ).body,
          { status: HttpStatus.OK },
        ),
      );

      const req = new NextRequest("http://localhost:3000/api/tenant");
      const res = await getTenants(req);
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.OK);
      expect(json.success).toBe(true);
      expect(json.data.tenants).toHaveLength(1);
      expect(json.meta.total).toBe(1);
    });
  });

  describe("POST /api/tenant", () => {
    it("returns 403 FORBIDDEN when accessed by a STUDENT session", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce({
        userId: "student-1",
        username: "student01",
        role: AppRole.STUDENT,
        tenantId: "tenant-1",
      });

      vi.mocked(mockController.create).mockResolvedValueOnce(
        NextResponse.json(
          ApiResponse.error(
            "FORBIDDEN",
            "Akses ditolak: role STUDENT tidak memiliki permission tenant.create",
            HttpStatus.FORBIDDEN,
          ).body,
          { status: HttpStatus.FORBIDDEN },
        ),
      );

      const req = new NextRequest("http://localhost:3000/api/tenant", {
        method: "POST",
        body: JSON.stringify({ name: "New Tenant", slug: "new-tenant" }),
      });
      const res = await createTenant(req);
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("FORBIDDEN");
    });

    it("returns 201 CREATED when accessed by an ADMIN session", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce({
        userId: "admin-1",
        username: "admin01",
        role: AppRole.ADMIN,
        tenantId: "",
      });

      vi.mocked(mockController.create).mockResolvedValueOnce(
        NextResponse.json(
          ApiResponse.success(
            { id: "tenant-new", name: "New Tenant", slug: "new-tenant" },
            undefined,
            HttpStatus.CREATED,
          ).body,
          { status: HttpStatus.CREATED },
        ),
      );

      const req = new NextRequest("http://localhost:3000/api/tenant", {
        method: "POST",
        body: JSON.stringify({ name: "New Tenant", slug: "new-tenant" }),
      });
      const res = await createTenant(req);
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.CREATED);
      expect(json.success).toBe(true);
      expect(json.data.slug).toBe("new-tenant");
    });
  });

  describe("GET /api/tenant/[tenantId]", () => {
    it("returns 403 FORBIDDEN when accessed by a STUDENT session", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce({
        userId: "student-1",
        username: "student01",
        role: AppRole.STUDENT,
        tenantId: "tenant-1",
      });

      vi.mocked(mockController.getOne).mockResolvedValueOnce(
        NextResponse.json(
          ApiResponse.error(
            "FORBIDDEN",
            "Akses ditolak: role STUDENT tidak memiliki permission tenant.read",
            HttpStatus.FORBIDDEN,
          ).body,
          { status: HttpStatus.FORBIDDEN },
        ),
      );

      const req = new NextRequest("http://localhost:3000/api/tenant/tenant-1");
      const res = await getTenantById(req, {
        params: Promise.resolve({ tenantId: "tenant-1" }),
      });
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("FORBIDDEN");
    });
  });

  describe("PATCH /api/tenant/[tenantId]", () => {
    it("returns 403 FORBIDDEN when accessed by a STUDENT session", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce({
        userId: "student-1",
        username: "student01",
        role: AppRole.STUDENT,
        tenantId: "tenant-1",
      });

      vi.mocked(mockController.update).mockResolvedValueOnce(
        NextResponse.json(
          ApiResponse.error(
            "FORBIDDEN",
            "Akses ditolak: role STUDENT tidak memiliki permission tenant.update",
            HttpStatus.FORBIDDEN,
          ).body,
          { status: HttpStatus.FORBIDDEN },
        ),
      );

      const req = new NextRequest("http://localhost:3000/api/tenant/tenant-1", {
        method: "PATCH",
        body: JSON.stringify({ name: "Updated Name" }),
      });
      const res = await updateTenant(req, {
        params: Promise.resolve({ tenantId: "tenant-1" }),
      });
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
      expect(json.success).toBe(false);
    });
  });

  describe("DELETE /api/tenant/[tenantId]", () => {
    it("returns 403 FORBIDDEN when accessed by a STUDENT session", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce({
        userId: "student-1",
        username: "student01",
        role: AppRole.STUDENT,
        tenantId: "tenant-1",
      });

      vi.mocked(mockController.remove).mockResolvedValueOnce(
        NextResponse.json(
          ApiResponse.error(
            "FORBIDDEN",
            "Akses ditolak: role STUDENT tidak memiliki permission tenant.delete",
            HttpStatus.FORBIDDEN,
          ).body,
          { status: HttpStatus.FORBIDDEN },
        ),
      );

      const req = new NextRequest("http://localhost:3000/api/tenant/tenant-1", {
        method: "DELETE",
      });
      const res = await deleteTenant(req, {
        params: Promise.resolve({ tenantId: "tenant-1" }),
      });
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
      expect(json.success).toBe(false);
    });
  });

  describe("PUT /api/tenant/[tenantId]/credentials", () => {
    it("returns 403 FORBIDDEN when accessed by a STUDENT session", async () => {
      vi.mocked(getCurrentUser).mockResolvedValueOnce({
        userId: "student-1",
        username: "student01",
        role: AppRole.STUDENT,
        tenantId: "tenant-1",
      });

      vi.mocked(mockController.configureCredentials).mockResolvedValueOnce(
        NextResponse.json(
          ApiResponse.error(
            "FORBIDDEN",
            "Akses ditolak: role STUDENT tidak memiliki permission tenant.credential.write",
            HttpStatus.FORBIDDEN,
          ).body,
          { status: HttpStatus.FORBIDDEN },
        ),
      );

      const req = new NextRequest(
        "http://localhost:3000/api/tenant/tenant-1/credentials",
        {
          method: "PUT",
          body: JSON.stringify({
            moodleUrl: "https://moodle.test",
            adminToken: "secret-token",
          }),
        },
      );
      const res = await configureCredentials(req, {
        params: Promise.resolve({ tenantId: "tenant-1" }),
      });
      const json = await res.json();

      expect(res.status).toBe(HttpStatus.FORBIDDEN);
      expect(json.success).toBe(false);
    });
  });
});
