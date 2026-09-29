import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { AppRole } from "@/core/rbac/AppRole";
import type { CreateUsersUseCase } from "../../application/usecases/CreateUsersUseCase";
import type { ImportUsersUseCase } from "../../application/usecases/ImportUsersUseCase";
import type { ListUsersUseCase } from "../../application/usecases/ListUsersUseCase";
import { UserController } from "../../infrastructure/http/UserController";

describe("UserController", () => {
  const tenantActor: CurrentActor = {
    userId: "tenant-admin-1",
    username: "tenantadmin",
    role: AppRole.TENANT,
    tenantId: "tenant-1",
  };

  const studentActor: CurrentActor = {
    userId: "student-1",
    username: "student01",
    role: AppRole.STUDENT,
    tenantId: "tenant-1",
  };

  const createMockUseCases = () => ({
    listUsersUseCase: {
      execute: vi.fn().mockResolvedValue({
        users: [
          {
            id: 1,
            username: "user1",
            firstname: "User",
            lastname: "One",
            fullname: "User One",
            email: "user1@example.com",
            idnumber: null,
            department: null,
            institution: null,
            suspended: false,
            firstAccess: null,
            lastAccess: null,
            profileImageUrl: null,
          },
        ],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    },
    createUsersUseCase: {
      execute: vi.fn().mockResolvedValue([{ id: 1, username: "new_user" }]),
    },
    importUsersUseCase: {
      execute: vi.fn().mockResolvedValue({
        importedCount: 1,
        failedCount: 0,
        createdUsers: [{ id: 1, username: "new_user" }],
        errors: [],
      }),
    },
  });

  it("lists users for authorized tenant actor", async () => {
    const mocks = createMockUseCases();
    const controller = new UserController(
      mocks.listUsersUseCase as unknown as ListUsersUseCase,
      mocks.createUsersUseCase as unknown as CreateUsersUseCase,
      mocks.importUsersUseCase as unknown as ImportUsersUseCase,
    );

    const req = new NextRequest("http://localhost/api/users?search=user1");
    const response = await controller.list(tenantActor, req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.users).toHaveLength(1);
    expect(mocks.listUsersUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantId: "tenant-1",
        query: expect.objectContaining({ search: "user1" }),
      }),
    );
  });

  it("rejects unauthorized student actor from listing users with 403", async () => {
    const mocks = createMockUseCases();
    const controller = new UserController(
      mocks.listUsersUseCase as unknown as ListUsersUseCase,
      mocks.createUsersUseCase as unknown as CreateUsersUseCase,
      mocks.importUsersUseCase as unknown as ImportUsersUseCase,
    );

    const req = new NextRequest("http://localhost/api/users");
    const response = await controller.list(studentActor, req);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
  });

  it("creates user when valid data provided", async () => {
    const mocks = createMockUseCases();
    const controller = new UserController(
      mocks.listUsersUseCase as unknown as ListUsersUseCase,
      mocks.createUsersUseCase as unknown as CreateUsersUseCase,
      mocks.importUsersUseCase as unknown as ImportUsersUseCase,
    );

    const req = new NextRequest("http://localhost/api/users", {
      method: "POST",
      body: JSON.stringify({
        username: "new_user",
        firstname: "New",
        lastname: "User",
        email: "new@example.com",
      }),
    });

    const response = await controller.create(tenantActor, req);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(mocks.createUsersUseCase.execute).toHaveBeenCalled();
  });

  it("imports users from CSV content", async () => {
    const mocks = createMockUseCases();
    const controller = new UserController(
      mocks.listUsersUseCase as unknown as ListUsersUseCase,
      mocks.createUsersUseCase as unknown as CreateUsersUseCase,
      mocks.importUsersUseCase as unknown as ImportUsersUseCase,
    );

    const req = new NextRequest("http://localhost/api/users/import", {
      method: "POST",
      body: JSON.stringify({
        csvContent:
          "username,firstname,lastname,email\nnew_user,New,User,new@example.com",
      }),
    });

    const response = await controller.import(tenantActor, req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.importedCount).toBe(1);
  });
});
