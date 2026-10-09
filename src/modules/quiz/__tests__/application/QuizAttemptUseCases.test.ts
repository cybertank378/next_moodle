import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { Permission } from "@/core/rbac/Permission";
import { GetAttemptDataUseCase } from "@/modules/quiz/application/usecases/GetAttemptDataUseCase";
import { GetAttemptSummaryUseCase } from "@/modules/quiz/application/usecases/GetAttemptSummaryUseCase";
import { GetUserAttemptsUseCase } from "@/modules/quiz/application/usecases/GetUserAttemptsUseCase";
import { SaveQuizAnswerUseCase } from "@/modules/quiz/application/usecases/SaveQuizAnswerUseCase";
import { StartQuizAttemptUseCase } from "@/modules/quiz/application/usecases/StartQuizAttemptUseCase";
import { SubmitQuizAttemptUseCase } from "@/modules/quiz/application/usecases/SubmitQuizAttemptUseCase";
import { QuizAttemptEntity } from "@/modules/quiz/domain/entity/QuizAttemptEntity";
import type { QuizAttemptRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizAttemptRepositoryInterface";
import { QuizAttemptMapper } from "@/modules/quiz/domain/mapper/QuizAttemptMapper";

describe("Quiz Attempt Use Cases", () => {
  let mockRepo: QuizAttemptRepositoryInterface;

  const studentA: AuthorizationActor = {
    id: "student-1",
    role: AppRole.STUDENT,
    tenantId: "tenant-a",
    permissions: [
      Permission.ATTEMPT_START,
      Permission.ATTEMPT_SAVE_OWN,
      Permission.ATTEMPT_SUBMIT_OWN,
      Permission.ATTEMPT_READ_OWN,
    ],
  };

  const studentB: AuthorizationActor = {
    id: "student-2",
    role: AppRole.STUDENT,
    tenantId: "tenant-a",
    permissions: [
      Permission.ATTEMPT_START,
      Permission.ATTEMPT_SAVE_OWN,
      Permission.ATTEMPT_SUBMIT_OWN,
      Permission.ATTEMPT_READ_OWN,
    ],
  };

  const attemptOwnedByStudentA = new QuizAttemptEntity(1001, "tenant-a", {
    id: 1001,
    quizId: 50,
    userId: "student-1",
    moodleUserId: 101,
    attemptNumber: 1,
    state: "IN_PROGRESS",
    timeStart: 1700000000,
    timeFinish: 0,
    timeModified: 1700000000,
    currentPage: 0,
  });

  beforeEach(() => {
    mockRepo = {
      startAttempt: vi.fn(),
      getAttemptById: vi.fn(),
      getUserAttempts: vi.fn(),
      getAttemptData: vi.fn(),
      getAttemptSummary: vi.fn(),
      saveAttempt: vi.fn(),
      processAttempt: vi.fn(),
    };
  });

  describe("🔴 RED Requirement 1: Attempt Save Ownership Rule", () => {
    it("throws AuthorizationError when a different STUDENT attempts to save another student's attempt", async () => {
      vi.mocked(mockRepo.getAttemptById).mockResolvedValue(
        attemptOwnedByStudentA,
      );

      const saveUseCase = new SaveQuizAnswerUseCase(mockRepo);

      // Student B attempts to save answers for Student A's attempt
      await expect(
        saveUseCase.execute({
          actor: studentB,
          studentMoodleToken: "mock-token-student-b",
          attemptId: 1001,
          answers: { "q1:1_answer": "option_b" },
        }),
      ).rejects.toThrowError(AuthorizationError);

      expect(mockRepo.saveAttempt).not.toHaveBeenCalled();
    });

    it("throws NotFoundError when saving answers for a non-existent attempt", async () => {
      vi.mocked(mockRepo.getAttemptById).mockResolvedValue(null);

      const saveUseCase = new SaveQuizAnswerUseCase(mockRepo);

      await expect(
        saveUseCase.execute({
          actor: studentA,
          studentMoodleToken: "mock-token-student-a",
          attemptId: 9999,
          answers: { "q1:1_answer": "option_a" },
        }),
      ).rejects.toThrowError(NotFoundError);
    });

    it("successfully saves answers when student is the owner", async () => {
      vi.mocked(mockRepo.getAttemptById).mockResolvedValue(
        attemptOwnedByStudentA,
      );
      vi.mocked(mockRepo.saveAttempt).mockResolvedValue(true);

      const saveUseCase = new SaveQuizAnswerUseCase(mockRepo);

      const result = await saveUseCase.execute({
        actor: studentA,
        studentMoodleToken: "mock-token-student-a",
        attemptId: 1001,
        answers: { "q1:1_answer": "option_a" },
      });

      expect(result.success).toBe(true);
      expect(result.attemptId).toBe(1001);
      expect(mockRepo.saveAttempt).toHaveBeenCalledWith(
        "tenant-a",
        "mock-token-student-a",
        1001,
        [{ name: "q1:1_answer", value: "option_a" }],
      );
    });
  });

  describe("🔴 RED Requirement 2: Formatting Answer Data to Moodle Payload", () => {
    it("formats key-value answer dictionary to Moodle's name-value pair array structure", () => {
      const answersDict = {
        "q1:1_answer": "1",
        "q1:1_:sequencecheck": "1",
        "q2:1_answer": "Jakarta",
      };

      const payload = QuizAttemptMapper.toMoodleAnswerPayload(answersDict);

      expect(payload).toEqual([
        { name: "q1:1_answer", value: "1" },
        { name: "q1:1_:sequencecheck", value: "1" },
        { name: "q2:1_answer", value: "Jakarta" },
      ]);
    });

    it("formats structured question answer objects into Moodle name-value pairs", () => {
      const structuredAnswers = [
        {
          slot: 1,
          answer: "option_a",
          sequenceCheck: 2,
        },
        {
          slot: 2,
          answer: "True",
        },
      ];

      const payload =
        QuizAttemptMapper.toMoodleAnswerPayload(structuredAnswers);

      expect(payload).toEqual([
        { name: "q1:1_answer", value: "option_a" },
        { name: "q1:1_:sequencecheck", value: "2" },
        { name: "q2:1_answer", value: "True" },
      ]);
    });
  });

  describe("SubmitQuizAttemptUseCase", () => {
    it("throws AuthorizationError when student B tries to submit student A's attempt", async () => {
      vi.mocked(mockRepo.getAttemptById).mockResolvedValue(
        attemptOwnedByStudentA,
      );

      const submitUseCase = new SubmitQuizAttemptUseCase(mockRepo);

      await expect(
        submitUseCase.execute({
          actor: studentB,
          studentMoodleToken: "mock-token-student-b",
          attemptId: 1001,
        }),
      ).rejects.toThrowError(AuthorizationError);

      expect(mockRepo.processAttempt).not.toHaveBeenCalled();
    });

    it("successfully submits attempt with finishattempt: true", async () => {
      vi.mocked(mockRepo.getAttemptById).mockResolvedValue(
        attemptOwnedByStudentA,
      );
      vi.mocked(mockRepo.processAttempt).mockResolvedValue({
        state: "FINISHED",
      });

      const submitUseCase = new SubmitQuizAttemptUseCase(mockRepo);

      const result = await submitUseCase.execute({
        actor: studentA,
        studentMoodleToken: "mock-token-student-a",
        attemptId: 1001,
        answers: { "q1:1_answer": "final_choice" },
      });

      expect(result.success).toBe(true);
      expect(result.state).toBe("FINISHED");
      expect(mockRepo.processAttempt).toHaveBeenCalledWith(
        "tenant-a",
        "mock-token-student-a",
        1001,
        [{ name: "q1:1_answer", value: "final_choice" }],
        true,
        false,
      );
    });
  });

  describe("StartQuizAttemptUseCase", () => {
    it("successfully starts a new quiz attempt", async () => {
      vi.mocked(mockRepo.startAttempt).mockResolvedValue(
        attemptOwnedByStudentA,
      );

      const startUseCase = new StartQuizAttemptUseCase(mockRepo);

      const result = await startUseCase.execute({
        actor: studentA,
        studentMoodleToken: "mock-token-student-a",
        quizId: 50,
      });

      expect(result.id).toBe(1001);
      expect(result.quizId).toBe(50);
      expect(result.state).toBe("IN_PROGRESS");
    });
  });

  describe("GetUserAttemptsUseCase", () => {
    it("returns mapped attempt dtos for the student", async () => {
      vi.mocked(mockRepo.getUserAttempts).mockResolvedValue([
        attemptOwnedByStudentA,
      ]);

      const getUserAttemptsUseCase = new GetUserAttemptsUseCase(mockRepo);

      const results = await getUserAttemptsUseCase.execute({
        actor: studentA,
        studentMoodleToken: "mock-token-student-a",
        quizId: 50,
      });

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(1001);
    });
  });

  describe("GetAttemptDataUseCase", () => {
    it("throws AuthorizationError when attempt belongs to another student", async () => {
      vi.mocked(mockRepo.getAttemptData).mockResolvedValue({
        attempt: QuizAttemptMapper.toDto(attemptOwnedByStudentA),
        questions: [],
        nextPage: -1,
      });

      const getDataUseCase = new GetAttemptDataUseCase(mockRepo);

      await expect(
        getDataUseCase.execute({
          actor: studentB,
          studentMoodleToken: "mock-token-student-b",
          attemptId: 1001,
          page: 0,
        }),
      ).rejects.toThrowError(AuthorizationError);
    });
  });

  describe("GetAttemptSummaryUseCase", () => {
    it("returns attempt summary questions", async () => {
      vi.mocked(mockRepo.getAttemptSummary).mockResolvedValue({
        questions: [
          {
            slot: 1,
            number: 1,
            status: "Answered",
          },
        ],
      });

      const getSummaryUseCase = new GetAttemptSummaryUseCase(mockRepo);

      const result = await getSummaryUseCase.execute({
        actor: studentA,
        studentMoodleToken: "mock-token-student-a",
        attemptId: 1001,
      });

      expect(result.questions).toHaveLength(1);
      expect(result.questions[0].slot).toBe(1);
    });
  });
});
