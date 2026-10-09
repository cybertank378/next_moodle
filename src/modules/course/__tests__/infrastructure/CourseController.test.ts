import type { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { Result } from "@/core/base/Result";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { AppRole } from "@/core/rbac/AppRole";
import type { GetCourseContentsUseCase } from "@/modules/course/application/usecases/GetCourseContentsUseCase";
import type { GetUserCoursesUseCase } from "@/modules/course/application/usecases/GetUserCoursesUseCase";
import { CourseController } from "@/modules/course/infrastructure/http/CourseController";

describe("CourseController", () => {
  const studentActor: CurrentActor = {
    userId: "user-1",
    email: "student@example.com",
    role: AppRole.STUDENT,
    tenantId: "tenant-1",
    moodleUserId: 10,
  } as any;

  it("returns 200 with course list on successful list execution", async () => {
    const mockGetUserCourses = {
      execute: vi.fn().mockResolvedValue(
        Result.ok({
          courses: [
            {
              id: 1,
              shortName: "MATH101",
              fullName: "Math 101",
              displayName: "Math 101",
              idNumber: null,
              summary: "",
              format: "topics",
              startDate: null,
              endDate: null,
              categoryId: null,
              progress: 10,
              isCompleted: false,
              imageUrl: null,
            },
          ],
          total: 1,
        }),
      ),
    } as unknown as GetUserCoursesUseCase;

    const mockGetCourseContents = {} as unknown as GetCourseContentsUseCase;
    const controller = new CourseController(
      mockGetUserCourses,
      mockGetCourseContents,
    );

    const mockReq = {
      nextUrl: {
        searchParams: new URLSearchParams("search=math"),
      },
    } as unknown as NextRequest;

    const response = await controller.list(studentActor, mockReq);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.courses).toHaveLength(1);
    expect(body.meta.total).toBe(1);
  });

  it("maps error to appropriate HTTP status on use case failure", async () => {
    const mockGetUserCourses = {
      execute: vi
        .fn()
        .mockResolvedValue(Result.fail(new ForbiddenError("Access denied"))),
    } as unknown as GetUserCoursesUseCase;

    const mockGetCourseContents = {} as unknown as GetCourseContentsUseCase;
    const controller = new CourseController(
      mockGetUserCourses,
      mockGetCourseContents,
    );

    const mockReq = {
      nextUrl: {
        searchParams: new URLSearchParams(),
      },
    } as unknown as NextRequest;

    const response = await controller.list(studentActor, mockReq);
    expect(response.status).toBe(403);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("FORBIDDEN");
  });

  it("returns course contents on getContents", async () => {
    const mockGetUserCourses = {} as unknown as GetUserCoursesUseCase;
    const mockGetCourseContents = {
      execute: vi.fn().mockResolvedValue(
        Result.ok([
          {
            id: 1,
            name: "Topic 1",
            sectionNumber: 0,
            summary: "",
            isVisible: true,
            modules: [],
          },
        ]),
      ),
    } as unknown as GetCourseContentsUseCase;

    const controller = new CourseController(
      mockGetUserCourses,
      mockGetCourseContents,
    );

    const response = await controller.getContents(studentActor, 101);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveLength(1);
  });

  it("returns 400 BAD_REQUEST when courseId is not a valid number", async () => {
    const mockGetUserCourses = {} as unknown as GetUserCoursesUseCase;
    const mockGetCourseContents = {} as unknown as GetCourseContentsUseCase;
    const controller = new CourseController(
      mockGetUserCourses,
      mockGetCourseContents,
    );

    const response = await controller.getContents(studentActor, "invalid");
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("VALIDATION_ERROR");
  });
});
