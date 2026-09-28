import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { Result } from "@/core/base/Result";
import { AppRole } from "@/core/rbac/AppRole";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import type { ConfigureTenantCredentialUseCase } from "@/modules/tenant/application/usecases/ConfigureTenantCredentialUseCase";
import type { CreateTenantUseCase } from "@/modules/tenant/application/usecases/CreateTenantUseCase";
import type { DeleteTenantUseCase } from "@/modules/tenant/application/usecases/DeleteTenantUseCase";
import type { GetAllTenantsUseCase } from "@/modules/tenant/application/usecases/GetAllTenantsUseCase";
import type { GetTenantByIdUseCase } from "@/modules/tenant/application/usecases/GetTenantByIdUseCase";
import type { UpdateTenantStatusUseCase } from "@/modules/tenant/application/usecases/UpdateTenantStatusUseCase";
import type { UpdateTenantUseCase } from "@/modules/tenant/application/usecases/UpdateTenantUseCase";
import { TenantController } from "@/modules/tenant/infrastructure/http/TenantController";

describe("TenantController", () => {
  const studentActor: CurrentActor = {
    userId: "student-123",
    username: "student01",
    role: AppRole.STUDENT,
    tenantId: "tenant-1",
  };

  const adminActor: CurrentActor = {
    userId: "admin-1",
    username: "admin01",
    role: AppRole.ADMIN,
    tenantId: "",
  };

  const createMockUseCases = () => ({
    listTenants: {
      execute: vi.fn(),
    },
    getTenant: {
      execute: vi.fn(),
    },
    createTenant: {
      execute: vi.fn(),
    },
    updateTenant: {
      execute: vi.fn(),
    },
    updateTenantStatus: {
      execute: vi.fn(),
    },
    deleteTenant: {
      execute: vi.fn(),
    },
    configureCredential: {
      execute: vi.fn(),
    },
  });

  const createController = (mocks: ReturnType<typeof createMockUseCases>) => {
    return new TenantController(
      mocks.listTenants as unknown as GetAllTenantsUseCase,
      mocks.getTenant as unknown as GetTenantByIdUseCase,
      mocks.createTenant as unknown as CreateTenantUseCase,
      mocks.updateTenant as unknown as UpdateTenantUseCase,
      mocks.updateTenantStatus as unknown as UpdateTenantStatusUseCase,
      mocks.deleteTenant as unknown as DeleteTenantUseCase,
      mocks.configureCredential as unknown as ConfigureTenantCredentialUseCase,
    );
  };

  it("returns 403 FORBIDDEN when listTenants use case rejects STUDENT actor", async () => {
    const mocks = createMockUseCases();
    mocks.listTenants.execute.mockResolvedValueOnce(
      Result.fail(
        new AuthorizationError(
          "Akses ditolak: role STUDENT tidak memiliki permission tenant.read",
        ),
      ),
    );

    const controller = createController(mocks);
    const req = new NextRequest(
      "http://localhost:3000/api/tenants?page=1&pageSize=10",
    );
    const response = await controller.list(studentActor, req);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("FORBIDDEN");
    expect(body.error.message).toContain("tenant.read");
  });

  it("returns 200 OK with formatted envelope and metadata when ADMIN lists tenants", async () => {
    const mocks = createMockUseCases();
    mocks.listTenants.execute.mockResolvedValueOnce(
      Result.ok({
        tenants: [
          {
            id: "tenant-1",
            name: "Test Tenant",
            slug: "test-tenant",
            status: "ACTIVE",
            hasMoodleCredential: true,
            hasBranding: false,
            customDomain: null,
            createdAt: "2026-09-01T00:00:00.000Z",
            updatedAt: "2026-09-01T00:00:00.000Z",
          },
        ],
        total: 1,
        page: 1,
        pageSize: 10,
      }),
    );

    const controller = createController(mocks);
    const req = new NextRequest("http://localhost:3000/api/tenants");
    const response = await controller.list(adminActor, req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.tenants).toHaveLength(1);
    expect(body.meta).toEqual({
      total: 1,
      page: 1,
      pageSize: 10,
    });
  });

  it("returns 201 CREATED when ADMIN creates a new tenant", async () => {
    const mocks = createMockUseCases();
    mocks.createTenant.execute.mockResolvedValueOnce(
      Result.ok({
        id: "tenant-created",
        name: "Created Tenant",
        slug: "created-tenant",
        status: "ACTIVE",
        hasMoodleCredential: false,
        hasBranding: false,
        customDomain: null,
        createdAt: "2026-09-28T00:00:00.000Z",
        updatedAt: "2026-09-28T00:00:00.000Z",
      }),
    );

    const controller = createController(mocks);
    const req = new NextRequest("http://localhost:3000/api/tenants", {
      method: "POST",
      body: JSON.stringify({
        name: "Created Tenant",
        slug: "created-tenant",
      }),
    });
    const response = await controller.create(adminActor, req);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.id).toBe("tenant-created");
  });

  it("returns 400 BAD_REQUEST when request body contains invalid JSON", async () => {
    const mocks = createMockUseCases();
    const controller = createController(mocks);

    const req = new NextRequest("http://localhost:3000/api/tenants", {
      method: "POST",
      body: "not a valid json",
    });
    const response = await controller.create(adminActor, req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });
});
