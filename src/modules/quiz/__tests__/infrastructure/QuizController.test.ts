import type { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { Result } from "@/core/base/Result";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { AppRole } from "@/core/rbac/AppRole";
import type { CheckQuizAccessUseCase } from "../../application/usecases/CheckQuizAccessUseCase";
import type { GetQuizDetailUseCase } from "../../application/usecases/GetQuizDetailUseCase";
import type { GetQuizzesByCourseUseCase } from "../../application/usecases/GetQuizzesByCourseUseCase";
import { QuizController } from "../../infrastructure/http/QuizController";

describe("QuizController", () => {
  const studentActor: CurrentActor = {
    userId: "user-1",
    email: "student@example.com",
    role: AppRole.STUDENT,
    tenantId: "tenant-1",
    moodleUserId: 10,
  } as any;

  it("returns 200 with quiz list on successful list execution", async () => {
    const mockGetQuizzes = {
      execute: vi.fn().mockResolvedValue(
        Result.ok({
          quizzes: [
            {
              id: 1,
              courseId: 5,
              courseModuleId: 10,
              name: "Kuis Kimia",
              intro: "",
              timeOpen: 0,
              timeClose: 0,
              timeLimitSeconds: 1800,
              maxAttempts: 1,
              grade: 100,
              isVisible: true,
              status: "OPEN",
            },
          ],
          total: 1,
        }),
      ),
    } as unknown as GetQuizzesByCourseUseCase;

    const mockGetDetail = {} as unknown as GetQuizDetailUseCase;
    const mockCheckAccess = {} as unknown as CheckQuizAccessUseCase;

    const controller = new QuizController(
      mockGetQuizzes,
      mockGetDetail,
      mockCheckAccess,
    );

    const mockReq = {
      nextUrl: {
        searchParams: new URLSearchParams("courseId=5"),
      },
    } as unknown as NextRequest;

    const res = await controller.list(studentActor, mockReq);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.quizzes).toHaveLength(1);
    expect(json.meta.total).toBe(1);
  });

  it("returns 403 on authorization failure", async () => {
    const mockGetQuizzes = {
      execute: vi
        .fn()
        .mockResolvedValue(Result.fail(new ForbiddenError("Akses ditolak"))),
    } as unknown as GetQuizzesByCourseUseCase;

    const controller = new QuizController(mockGetQuizzes, {} as any, {} as any);

    const mockReq = {
      nextUrl: {
        searchParams: new URLSearchParams(),
      },
    } as unknown as NextRequest;

    const res = await controller.list(studentActor, mockReq);
    expect(res.status).toBe(403);
  });

  it("returns 400 on invalid quizId input in getDetail", async () => {
    const controller = new QuizController({} as any, {} as any, {} as any);

    const res = await controller.getDetail(studentActor, "invalid-id");
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 404 when quiz not found in getDetail", async () => {
    const mockGetDetail = {
      execute: vi
        .fn()
        .mockResolvedValue(
          Result.fail(new NotFoundError("Kuis tidak ditemukan")),
        ),
    } as unknown as GetQuizDetailUseCase;

    const controller = new QuizController({} as any, mockGetDetail, {} as any);

    const res = await controller.getDetail(studentActor, 999);
    expect(res.status).toBe(404);
  });

  it("returns 200 with access validation on checkAccess", async () => {
    const mockCheckAccess = {
      execute: vi.fn().mockResolvedValue(
        Result.ok({
          quizId: 10,
          canAttempt: true,
          status: "OPEN",
          reasons: [],
          timeOpen: 1700000000,
          timeClose: 1700003600,
          timeLimitSeconds: 1800,
        }),
      ),
    } as unknown as CheckQuizAccessUseCase;

    const controller = new QuizController(
      {} as any,
      {} as any,
      mockCheckAccess,
    );

    const res = await controller.checkAccess(studentActor, 10);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.canAttempt).toBe(true);
  });
});
