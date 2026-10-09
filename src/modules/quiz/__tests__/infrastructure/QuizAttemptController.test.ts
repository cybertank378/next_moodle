import type { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { AppRole } from "@/core/rbac/AppRole";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import type { GetAttemptDataUseCase } from "@/modules/quiz/application/usecases/GetAttemptDataUseCase";
import type { GetAttemptSummaryUseCase } from "@/modules/quiz/application/usecases/GetAttemptSummaryUseCase";
import type { GetUserAttemptsUseCase } from "@/modules/quiz/application/usecases/GetUserAttemptsUseCase";
import type { SaveQuizAnswerUseCase } from "@/modules/quiz/application/usecases/SaveQuizAnswerUseCase";
import type { StartQuizAttemptUseCase } from "@/modules/quiz/application/usecases/StartQuizAttemptUseCase";
import type { SubmitQuizAttemptUseCase } from "@/modules/quiz/application/usecases/SubmitQuizAttemptUseCase";
import { QuizAttemptController } from "@/modules/quiz/infrastructure/http/QuizAttemptController";

describe("QuizAttemptController", () => {
  const studentActor: CurrentActor = {
    userId: "user-1",
    username: "student1",
    email: "student@example.com",
    role: AppRole.STUDENT,
    tenantId: "tenant-1",
    moodleUserId: 10,
    permissions: [
      "attempt.start",
      "attempt.save.own",
      "attempt.submit.own",
      "attempt.read.own",
    ],
  };

  const studentToken = "token-student-123";

  const dummyStart = {} as unknown as StartQuizAttemptUseCase;
  const dummySave = {} as unknown as SaveQuizAnswerUseCase;
  const dummySubmit = {} as unknown as SubmitQuizAttemptUseCase;
  const dummyList = {} as unknown as GetUserAttemptsUseCase;
  const dummyData = {} as unknown as GetAttemptDataUseCase;
  const dummySummary = {} as unknown as GetAttemptSummaryUseCase;

  it("returns 200 on successful start attempt", async () => {
    const mockStart = {
      execute: vi.fn().mockResolvedValue({
        id: 501,
        quizId: 22,
        state: "IN_PROGRESS",
      }),
    } as unknown as StartQuizAttemptUseCase;

    const controller = new QuizAttemptController(
      mockStart,
      dummySave,
      dummySubmit,
      dummyList,
      dummyData,
      dummySummary,
    );

    const mockReq = {
      json: vi.fn().mockResolvedValue({ quizId: 22 }),
    } as unknown as NextRequest;

    const res = await controller.start(studentActor, studentToken, mockReq);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.id).toBe(501);
  });

  it("returns 400 when start attempt body is missing quizId", async () => {
    const controller = new QuizAttemptController(
      dummyStart,
      dummySave,
      dummySubmit,
      dummyList,
      dummyData,
      dummySummary,
    );

    const mockReq = {
      json: vi.fn().mockResolvedValue({}),
    } as unknown as NextRequest;

    const res = await controller.start(studentActor, studentToken, mockReq);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });

  it("returns 200 on successful save answer", async () => {
    const mockSave = {
      execute: vi.fn().mockResolvedValue({
        success: true,
        attemptId: 501,
        savedAt: 1700000000,
      }),
    } as unknown as SaveQuizAnswerUseCase;

    const controller = new QuizAttemptController(
      dummyStart,
      mockSave,
      dummySubmit,
      dummyList,
      dummyData,
      dummySummary,
    );

    const mockReq = {
      json: vi.fn().mockResolvedValue({
        answers: { "q1:1_answer": "choice_a" },
      }),
    } as unknown as NextRequest;

    const res = await controller.save(
      studentActor,
      studentToken,
      "501",
      mockReq,
    );
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.attemptId).toBe(501);
  });

  it("returns 403 when save answer fails ownership check", async () => {
    const mockSave = {
      execute: vi
        .fn()
        .mockRejectedValue(
          new AuthorizationError(
            "Akses ditolak: bukan attempt milik siswa",
          ),
        ),
    } as unknown as SaveQuizAnswerUseCase;

    const controller = new QuizAttemptController(
      dummyStart,
      mockSave,
      dummySubmit,
      dummyList,
      dummyData,
      dummySummary,
    );

    const mockReq = {
      json: vi.fn().mockResolvedValue({
        answers: { "q1:1_answer": "choice_a" },
      }),
    } as unknown as NextRequest;

    const res = await controller.save(
      studentActor,
      studentToken,
      "501",
      mockReq,
    );
    expect(res.status).toBe(403);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("FORBIDDEN");
  });

  it("returns 404 when save answer target attempt is not found", async () => {
    const mockSave = {
      execute: vi
        .fn()
        .mockRejectedValue(new NotFoundError("Attempt tidak ditemukan")),
    } as unknown as SaveQuizAnswerUseCase;

    const controller = new QuizAttemptController(
      dummyStart,
      mockSave,
      dummySubmit,
      dummyList,
      dummyData,
      dummySummary,
    );

    const mockReq = {
      json: vi.fn().mockResolvedValue({
        answers: { "q1:1_answer": "choice_a" },
      }),
    } as unknown as NextRequest;

    const res = await controller.save(
      studentActor,
      studentToken,
      "999",
      mockReq,
    );
    expect(res.status).toBe(404);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("NOT_FOUND");
  });

  it("returns 200 on successful submit attempt", async () => {
    const mockSubmit = {
      execute: vi.fn().mockResolvedValue({
        success: true,
        attemptId: 501,
        state: "FINISHED",
        submittedAt: 1700000000,
      }),
    } as unknown as SubmitQuizAttemptUseCase;

    const controller = new QuizAttemptController(
      dummyStart,
      dummySave,
      mockSubmit,
      dummyList,
      dummyData,
      dummySummary,
    );

    const mockReq = {
      json: vi.fn().mockResolvedValue({}),
    } as unknown as NextRequest;

    const res = await controller.submit(
      studentActor,
      studentToken,
      "501",
      mockReq,
    );
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.state).toBe("FINISHED");
  });
});
