import { describe, expect, it, vi } from "vitest";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { CheckQuizAccessUseCase } from "@/modules/quiz/application/usecases/CheckQuizAccessUseCase";
import { QuizEntity } from "@/modules/quiz/domain/entity/QuizEntity";
import type { QuizRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizRepositoryInterface";

const studentActor: AuthorizationActor = {
  id: "student-1",
  role: AppRole.STUDENT,
  tenantId: "tenant-1",
  moodleUserId: 42,
};

describe("CheckQuizAccessUseCase", () => {
  it("returns CLOSED status and canAttempt false when timeclose has passed (waktu habis)", async () => {
    // Current time: 1700002000
    // Quiz closed at: 1700001000 (1000 seconds ago)
    const currentTime = 1700002000;
    const closedQuiz = new QuizEntity(501, "tenant-1", {
      id: 501,
      courseId: 10,
      courseModuleId: 25,
      name: "Ujian Akhir Semester",
      intro: "Ujian Matematika",
      timeOpen: 1700000000,
      timeClose: 1700001000,
      timeLimitSeconds: 3600,
      maxAttempts: 1,
      isVisible: true,
    });

    const mockRepo: QuizRepositoryInterface = {
      getQuizzesByCourses: vi.fn(),
      getQuizById: vi.fn().mockResolvedValue(closedQuiz),
      getQuizAccessInfo: vi.fn().mockResolvedValue(null),
    };

    const useCase = new CheckQuizAccessUseCase(mockRepo);
    const result = await useCase.execute({
      actor: studentActor,
      quizId: 501,
      currentTime,
    });

    expect(result.isSuccess).toBe(true);
    const access = result.getValue();
    expect(access.canAttempt).toBe(false);
    expect(access.status).toBe("CLOSED");
    expect(access.reasons.length).toBeGreaterThan(0);
    expect(access.reasons[0]).toMatch(/berakhir|tutup/i);
  });
});
