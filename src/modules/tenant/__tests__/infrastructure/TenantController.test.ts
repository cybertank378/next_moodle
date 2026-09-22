import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { Result } from "@/core/base/Result";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { AppRole } from "@/core/rbac/AppRole";
import type { CreateTenantUseCase } from "@/modules/tenant/application/usecases/CreateTenantUseCase";
import type { GetTenantsUseCase } from "@/modules/tenant/application/usecases/GetTenantsUseCase";
import type { GetTenantUseCase } from "@/modules/tenant/application/usecases/GetTenantUseCase";
import type { UpdateTenantStatusUseCase } from "@/modules/tenant/application/usecases/UpdateTenantStatusUseCase";
import type { UpdateTenantUseCase } from "@/modules/tenant/application/usecases/UpdateTenantUseCase";
import { TenantController } from "@/modules/tenant/infrastructure/http/TenantController";

describe("TenantController", () => {
  const adminActor: CurrentActor = {
    userId: "admin-1",
    username: "admin-1",
    role: AppRole.ADMIN,
    tenantId: "",
  };

  const createMockUseCases = () => ({
    getTenantsUseCase: {
      execute: vi.fn(),
    } as unknown as GetTenantsUseCase,
    getTenantUseCase: {
      execute: vi.fn(),
    } as unknown as GetTenantUseCase,
    createTenantUseCase: {
      execute: vi.fn(),
    } as unknown as CreateTenantUseCase,
    updateTenantUseCase: {
      execute: vi.fn(),
    } as unknown as UpdateTenantUseCase,
    updateTenantStatusUseCase: {
      execute: vi.fn(),
    } as unknown as UpdateTenantStatusUseCase,
  });

  describe("list", () => {
    it("should return 200 with tenant list and pagination metadata", async () => {
      const mocks = createMockUseCases();
      const mockResult = {
        tenants: [
          {
            id: "t-1",
            slug: "tenant-one",
            name: "Tenant One",
            status: "ACTIVE",
            customDomain: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        total: 1,
        page: 1,
        pageSize: 10,
      };
      (
        mocks.getTenantsUseCase.execute as ReturnType<typeof vi.fn>
      ).mockResolvedValue(Result.ok(mockResult));

      const controller = new TenantController(
        mocks.getTenantsUseCase,
        mocks.getTenantUseCase,
        mocks.createTenantUseCase,
        mocks.updateTenantUseCase,
        mocks.updateTenantStatusUseCase,
      );

      const req = new NextRequest(
        "http://localhost:3000/api/tenants?page=1&pageSize=10&status=ACTIVE",
      );
      const res = await controller.list(adminActor, req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.tenants).toHaveLength(1);
      expect(json.meta).toEqual({ total: 1, page: 1, pageSize: 10 });
    });

    it("should return error response when use case fails", async () => {
      const mocks = createMockUseCases();
      (
        mocks.getTenantsUseCase.execute as ReturnType<typeof vi.fn>
      ).mockResolvedValue(Result.fail(new NotFoundError("Tenants not found")));

      const controller = new TenantController(
        mocks.getTenantsUseCase,
        mocks.getTenantUseCase,
        mocks.createTenantUseCase,
        mocks.updateTenantUseCase,
        mocks.updateTenantStatusUseCase,
      );

      const req = new NextRequest("http://localhost:3000/api/tenants");
      const res = await controller.list(adminActor, req);
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("NOT_FOUND");
    });
  });

  describe("create", () => {
    it("should return 201 on successful tenant creation", async () => {
      const mocks = createMockUseCases();
      const createdTenant = {
        id: "t-new",
        slug: "new-school",
        name: "New School",
        status: "ACTIVE",
        customDomain: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (
        mocks.createTenantUseCase.execute as ReturnType<typeof vi.fn>
      ).mockResolvedValue(Result.ok(createdTenant));

      const controller = new TenantController(
        mocks.getTenantsUseCase,
        mocks.getTenantUseCase,
        mocks.createTenantUseCase,
        mocks.updateTenantUseCase,
        mocks.updateTenantStatusUseCase,
      );

      const req = new NextRequest("http://localhost:3000/api/tenants", {
        method: "POST",
        body: JSON.stringify({
          name: "New School",
          slug: "new-school",
        }),
      });

      const res = await controller.create(adminActor, req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json.success).toBe(true);
      expect(json.data.slug).toBe("new-school");
    });

    it("should return 400 when body is invalid", async () => {
      const mocks = createMockUseCases();
      const controller = new TenantController(
        mocks.getTenantsUseCase,
        mocks.getTenantUseCase,
        mocks.createTenantUseCase,
        mocks.updateTenantUseCase,
        mocks.updateTenantStatusUseCase,
      );

      const req = new NextRequest("http://localhost:3000/api/tenants", {
        method: "POST",
        body: JSON.stringify({
          name: "",
          slug: "INVALID SLUG!",
        }),
      });

      const res = await controller.create(adminActor, req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("getOne", () => {
    it("should return 200 with tenant detail", async () => {
      const mocks = createMockUseCases();
      const tenant = {
        id: "t-1",
        slug: "tenant-one",
        name: "Tenant One",
        status: "ACTIVE",
        customDomain: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (
        mocks.getTenantUseCase.execute as ReturnType<typeof vi.fn>
      ).mockResolvedValue(Result.ok(tenant));

      const controller = new TenantController(
        mocks.getTenantsUseCase,
        mocks.getTenantUseCase,
        mocks.createTenantUseCase,
        mocks.updateTenantUseCase,
        mocks.updateTenantStatusUseCase,
      );

      const res = await controller.getOne(adminActor, "t-1");
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.id).toBe("t-1");
    });

    it("should return 404 when tenant not found", async () => {
      const mocks = createMockUseCases();
      (
        mocks.getTenantUseCase.execute as ReturnType<typeof vi.fn>
      ).mockResolvedValue(
        Result.fail(new NotFoundError("Tenant tidak ditemukan.")),
      );

      const controller = new TenantController(
        mocks.getTenantsUseCase,
        mocks.getTenantUseCase,
        mocks.createTenantUseCase,
        mocks.updateTenantUseCase,
        mocks.updateTenantStatusUseCase,
      );

      const res = await controller.getOne(adminActor, "non-existent");
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.success).toBe(false);
    });
  });

  describe("update", () => {
    it("should return 200 on successful update", async () => {
      const mocks = createMockUseCases();
      const updated = {
        id: "t-1",
        slug: "tenant-one",
        name: "Updated Name",
        status: "ACTIVE",
        customDomain: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (
        mocks.updateTenantUseCase.execute as ReturnType<typeof vi.fn>
      ).mockResolvedValue(Result.ok(updated));

      const controller = new TenantController(
        mocks.getTenantsUseCase,
        mocks.getTenantUseCase,
        mocks.createTenantUseCase,
        mocks.updateTenantUseCase,
        mocks.updateTenantStatusUseCase,
      );

      const req = new NextRequest("http://localhost:3000/api/tenants/t-1", {
        method: "PATCH",
        body: JSON.stringify({ name: "Updated Name" }),
      });

      const res = await controller.update(adminActor, "t-1", req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.name).toBe("Updated Name");
    });
  });

  describe("updateStatus", () => {
    it("should return 200 on successful status update", async () => {
      const mocks = createMockUseCases();
      const updated = {
        id: "t-1",
        slug: "tenant-one",
        name: "Tenant One",
        status: "SUSPENDED",
        customDomain: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (
        mocks.updateTenantStatusUseCase.execute as ReturnType<typeof vi.fn>
      ).mockResolvedValue(Result.ok(updated));

      const controller = new TenantController(
        mocks.getTenantsUseCase,
        mocks.getTenantUseCase,
        mocks.createTenantUseCase,
        mocks.updateTenantUseCase,
        mocks.updateTenantStatusUseCase,
      );

      const req = new NextRequest(
        "http://localhost:3000/api/tenants/t-1/status",
        {
          method: "PATCH",
          body: JSON.stringify({ status: "SUSPENDED" }),
        },
      );

      const res = await controller.updateStatus(adminActor, "t-1", req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.status).toBe("SUSPENDED");
    });

    it("should return 400 when invalid status is provided", async () => {
      const mocks = createMockUseCases();
      const controller = new TenantController(
        mocks.getTenantsUseCase,
        mocks.getTenantUseCase,
        mocks.createTenantUseCase,
        mocks.updateTenantUseCase,
        mocks.updateTenantStatusUseCase,
      );

      const req = new NextRequest(
        "http://localhost:3000/api/tenants/t-1/status",
        {
          method: "PATCH",
          body: JSON.stringify({ status: "DELETED_INVALID" }),
        },
      );

      const res = await controller.updateStatus(adminActor, "t-1", req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.success).toBe(false);
      expect(json.error.code).toBe("VALIDATION_ERROR");
    });
  });
});
