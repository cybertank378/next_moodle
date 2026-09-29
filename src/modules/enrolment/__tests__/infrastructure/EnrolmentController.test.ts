import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { AppRole } from "@/core/rbac/AppRole";
import type { EnrolUsersUseCase } from "../../application/usecases/EnrolUsersUseCase";
import type { ListEnrolmentsUseCase } from "../../application/usecases/ListEnrolmentsUseCase";
import type { UnenrolUsersUseCase } from "../../application/usecases/UnenrolUsersUseCase";
import { EnrolmentController } from "../../infrastructure/http/EnrolmentController";

describe("EnrolmentController", () => {
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
    listEnrolmentsUseCase: {
      execute: vi.fn().mockResolvedValue({
        enrolments: [
          {
            id: 10,
            userId: 10,
            courseId: 2,
            username: "student01",
            firstname: "Student",
            lastname: "One",
            fullname: "Student One",
            email: "student01@example.com",
            idnumber: null,
            department: null,
            roles: [{ roleId: 5, name: "Student", shortname: "student" }],
            timestart: null,
            timeend: null,
            profileImageUrl: null,
          },
        ],
        total: 1,
        page: 1,
        pageSize: 20,
      }),
    },
    enrolUsersUseCase: {
      execute: vi.fn().mockResolvedValue(true),
    },
    unenrolUsersUseCase: {
      execute: vi.fn().mockResolvedValue(true),
    },
  });

  it("lists enrolments for a course for tenant actor", async () => {
    const mocks = createMockUseCases();
    const controller = new EnrolmentController(
      mocks.listEnrolmentsUseCase as unknown as ListEnrolmentsUseCase,
      mocks.enrolUsersUseCase as unknown as EnrolUsersUseCase,
      mocks.unenrolUsersUseCase as unknown as UnenrolUsersUseCase,
    );

    const req = new NextRequest("http://localhost/api/enrolments?courseId=2");
    const response = await controller.list(tenantActor, req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.enrolments).toHaveLength(1);
    expect(mocks.listEnrolmentsUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantId: "tenant-1",
        query: expect.objectContaining({ courseId: 2 }),
      }),
    );
  });

  it("rejects unauthorized student actor from listing enrolments with 403", async () => {
    const mocks = createMockUseCases();
    const controller = new EnrolmentController(
      mocks.listEnrolmentsUseCase as unknown as ListEnrolmentsUseCase,
      mocks.enrolUsersUseCase as unknown as EnrolUsersUseCase,
      mocks.unenrolUsersUseCase as unknown as UnenrolUsersUseCase,
    );

    const req = new NextRequest("http://localhost/api/enrolments?courseId=2");
    const response = await controller.list(studentActor, req);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
  });

  it("enrols users when valid payload provided", async () => {
    const mocks = createMockUseCases();
    const controller = new EnrolmentController(
      mocks.listEnrolmentsUseCase as unknown as ListEnrolmentsUseCase,
      mocks.enrolUsersUseCase as unknown as EnrolUsersUseCase,
      mocks.unenrolUsersUseCase as unknown as UnenrolUsersUseCase,
    );

    const req = new NextRequest("http://localhost/api/enrolments", {
      method: "POST",
      body: JSON.stringify({
        courseId: 2,
        userId: 10,
        roleId: 5,
      }),
    });

    const response = await controller.enrol(tenantActor, req);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(mocks.enrolUsersUseCase.execute).toHaveBeenCalled();
  });

  it("unenrols users when valid payload provided", async () => {
    const mocks = createMockUseCases();
    const controller = new EnrolmentController(
      mocks.listEnrolmentsUseCase as unknown as ListEnrolmentsUseCase,
      mocks.enrolUsersUseCase as unknown as EnrolUsersUseCase,
      mocks.unenrolUsersUseCase as unknown as UnenrolUsersUseCase,
    );

    const req = new NextRequest("http://localhost/api/enrolments", {
      method: "DELETE",
      body: JSON.stringify({
        courseId: 2,
        userId: 10,
      }),
    });

    const response = await controller.unenrol(tenantActor, req);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(mocks.unenrolUsersUseCase.execute).toHaveBeenCalled();
  });
});
