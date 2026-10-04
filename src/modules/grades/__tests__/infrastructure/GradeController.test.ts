import type { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { AppRole } from "@/core/rbac/AppRole";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { Permission } from "@/core/rbac/Permission";
import type { GetCourseGradesUseCase } from "@/modules/grades/application/usecases/GetCourseGradesUseCase";
import type { GetUserGradesUseCase } from "@/modules/grades/application/usecases/GetUserGradesUseCase";
import type {
  CourseGradesResponseDto,
  UserGradeReportResponseDto,
} from "@/modules/grades/domain/dto/GradeResponseDto";
import { GradeController } from "@/modules/grades/infrastructure/http/GradeController";

function createMockRequest(url: string): NextRequest {
  return new Request(url, {
    method: "GET",
  }) as unknown as NextRequest;
}

describe("GradeController - Ownership & Access Validation (RED -> GREEN)", () => {
  const studentActor: CurrentActor = {
    userId: "student-uuid-1",
    username: "student01",
    role: AppRole.STUDENT,
    tenantId: "tenant-1",
    moodleUserId: 101,
    permissions: [Permission.GRADE_READ_OWN],
  };

  const teacherActor: CurrentActor = {
    userId: "teacher-uuid-1",
    username: "teacher01",
    role: AppRole.TENANT,
    tenantId: "tenant-1",
    moodleUserId: 50,
    permissions: [Permission.GRADE_READ],
  };

  const mockUserReport: UserGradeReportResponseDto = {
    courseId: 10,
    userId: 101,
    userFullName: "John Student",
    courseTotal: {
      id: 1,
      itemName: "Total Kursus",
      itemType: "course",
      itemModule: null,
      itemInstance: null,
      gradeRaw: 88,
      gradeFormatted: "88.00",
      gradeMin: 0,
      gradeMax: 100,
      gradePass: 75,
      percentageFormatted: "88%",
      feedback: "Bagus",
      isPassed: true,
    },
    items: [
      {
        id: 2,
        itemName: "Quiz 1",
        itemType: "mod",
        itemModule: "quiz",
        itemInstance: 5,
        gradeRaw: 88,
        gradeFormatted: "88.00",
        gradeMin: 0,
        gradeMax: 100,
        gradePass: 75,
        percentageFormatted: "88%",
        feedback: null,
        isPassed: true,
      },
    ],
  };

  const mockCourseGrades: CourseGradesResponseDto = {
    courseId: 10,
    reports: [mockUserReport],
  };

  it("RED: should allow STUDENT to view their own grades when userId matches moodleUserId", async () => {
    const mockGetUserGradesUseCase = {
      execute: vi.fn().mockResolvedValue(mockUserReport),
    } as unknown as GetUserGradesUseCase;

    const mockGetCourseGradesUseCase = {
      execute: vi.fn().mockResolvedValue(mockCourseGrades),
    } as unknown as GetCourseGradesUseCase;

    const controller = new GradeController(
      mockGetUserGradesUseCase,
      mockGetCourseGradesUseCase,
    );

    const req = createMockRequest(
      "http://localhost:3000/api/grades?courseId=10&userId=101",
    );
    const response = await controller.getGrades(
      studentActor,
      "student-token",
      req,
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.userId).toBe(101);
  });

  it("RED: should allow STUDENT to view their own grades when userId is omitted (defaults to own)", async () => {
    const mockGetUserGradesUseCase = {
      execute: vi.fn().mockResolvedValue(mockUserReport),
    } as unknown as GetUserGradesUseCase;

    const mockGetCourseGradesUseCase = {
      execute: vi.fn().mockResolvedValue(mockCourseGrades),
    } as unknown as GetCourseGradesUseCase;

    const controller = new GradeController(
      mockGetUserGradesUseCase,
      mockGetCourseGradesUseCase,
    );

    const req = createMockRequest(
      "http://localhost:3000/api/grades?courseId=10",
    );
    const response = await controller.getGrades(
      studentActor,
      "student-token",
      req,
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(mockGetUserGradesUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        courseId: 10,
        userId: 101,
      }),
    );
  });

  it("RED: should reject STUDENT attempting to view another student's grade report with 403 Forbidden", async () => {
    const mockGetUserGradesUseCase = {
      execute: vi
        .fn()
        .mockRejectedValue(
          new AuthorizationError(
            "Akses ditolak: Siswa hanya dapat melihat rapor miliknya sendiri.",
          ),
        ),
    } as unknown as GetUserGradesUseCase;

    const mockGetCourseGradesUseCase = {
      execute: vi.fn(),
    } as unknown as GetCourseGradesUseCase;

    const controller = new GradeController(
      mockGetUserGradesUseCase,
      mockGetCourseGradesUseCase,
    );

    // Student 101 tries to request grades for userId 999
    const req = createMockRequest(
      "http://localhost:3000/api/grades?courseId=10&userId=999",
    );
    const response = await controller.getGrades(
      studentActor,
      "student-token",
      req,
    );

    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.message).toContain("Akses ditolak");
  });

  it("RED: should allow TEACHER/TENANT to view class grades with GRADE_READ permission", async () => {
    const mockGetUserGradesUseCase = {
      execute: vi.fn(),
    } as unknown as GetUserGradesUseCase;

    const mockGetCourseGradesUseCase = {
      execute: vi.fn().mockResolvedValue(mockCourseGrades),
    } as unknown as GetCourseGradesUseCase;

    const controller = new GradeController(
      mockGetUserGradesUseCase,
      mockGetCourseGradesUseCase,
    );

    const req = createMockRequest(
      "http://localhost:3000/api/grades?courseId=10",
    );
    const response = await controller.getGrades(teacherActor, undefined, req);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.reports).toHaveLength(1);
    expect(mockGetCourseGradesUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        courseId: 10,
      }),
    );
  });

  it("RED: should return 400 Bad Request when courseId is missing or invalid", async () => {
    const mockGetUserGradesUseCase = {
      execute: vi.fn(),
    } as unknown as GetUserGradesUseCase;

    const mockGetCourseGradesUseCase = {
      execute: vi.fn(),
    } as unknown as GetCourseGradesUseCase;

    const controller = new GradeController(
      mockGetUserGradesUseCase,
      mockGetCourseGradesUseCase,
    );

    const req = createMockRequest(
      "http://localhost:3000/api/grades?courseId=abc",
    );
    const response = await controller.getGrades(teacherActor, undefined, req);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  it("should export course grades as CSV with 200 and attachment header", async () => {
    const mockGetUserGradesUseCase = {} as unknown as GetUserGradesUseCase;
    const mockGetCourseGradesUseCase = {
      execute: vi.fn().mockResolvedValue(mockCourseGrades),
    } as unknown as GetCourseGradesUseCase;

    const controller = new GradeController(
      mockGetUserGradesUseCase,
      mockGetCourseGradesUseCase,
    );

    const req = createMockRequest(
      "http://localhost:3000/api/grades/export?courseId=10",
    );
    const response = await controller.exportGrades(teacherActor, req);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/csv");
    expect(response.headers.get("content-disposition")).toContain(
      'attachment; filename="nilai_kursus_10.csv"',
    );
    const buffer = Buffer.from(await response.arrayBuffer());
    // UTF-8 BOM is 0xEF, 0xBB, 0xBF
    expect(buffer[0]).toBe(0xef);
    expect(buffer[1]).toBe(0xbb);
    expect(buffer[2]).toBe(0xbf);
    const text = buffer.toString("utf-8");
    expect(text).toContain("John Student");
  });

  it("should return 400 Bad Request on exportGrades when courseId is invalid", async () => {
    const mockGetUserGradesUseCase = {} as unknown as GetUserGradesUseCase;
    const mockGetCourseGradesUseCase = {
      execute: vi.fn(),
    } as unknown as GetCourseGradesUseCase;

    const controller = new GradeController(
      mockGetUserGradesUseCase,
      mockGetCourseGradesUseCase,
    );

    const req = createMockRequest(
      "http://localhost:3000/api/grades/export?courseId=invalid",
    );
    const response = await controller.exportGrades(teacherActor, req);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
  });
});
