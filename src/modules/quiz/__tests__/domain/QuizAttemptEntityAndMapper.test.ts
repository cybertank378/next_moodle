import { describe, expect, it } from "vitest";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { QuizAttemptEntity } from "@/modules/quiz/domain/entity/QuizAttemptEntity";
import { QuizAttemptMapper } from "@/modules/quiz/domain/mapper/QuizAttemptMapper";
import type { RawMoodleAttempt } from "@/modules/quiz/domain/types/QuizAttemptTypes";

describe("QuizAttemptEntity and QuizAttemptMapper", () => {
  const sampleMetadata = {
    id: 101,
    quizId: 5,
    userId: "student-user-uuid",
    moodleUserId: 42,
    attemptNumber: 1,
    state: "IN_PROGRESS" as const,
    sumGrades: null,
    timeStart: 1700000000,
    timeFinish: 0,
    timeModified: 1700000000,
    currentPage: 0,
  };

  describe("QuizAttemptEntity", () => {
    it("instantiates correctly and exposes getters", () => {
      const entity = new QuizAttemptEntity(101, "tenant-alpha", sampleMetadata);

      expect(entity.id).toBe(101);
      expect(entity.tenantId).toBe("tenant-alpha");
      expect(entity.quizId).toBe(5);
      expect(entity.userId).toBe("student-user-uuid");
      expect(entity.moodleUserId).toBe(42);
      expect(entity.attemptNumber).toBe(1);
      expect(entity.state).toBe("IN_PROGRESS");
      expect(entity.isInProgress()).toBe(true);
      expect(entity.isFinished()).toBe(false);
      expect(entity.sumGrades).toBeNull();
      expect(entity.timeStart).toBe(1700000000);
      expect(entity.timeFinish).toBe(0);
      expect(entity.timeModified).toBe(1700000000);
      expect(entity.currentPage).toBe(0);
    });

    it("assertAttemptOwnership succeeds when actor userId matches", () => {
      const entity = new QuizAttemptEntity(101, "tenant-alpha", sampleMetadata);

      expect(() => {
        entity.assertAttemptOwnership("student-user-uuid");
      }).not.toThrow();
    });

    it("assertAttemptOwnership succeeds when actor moodleUserId matches", () => {
      const entity = new QuizAttemptEntity(101, "tenant-alpha", sampleMetadata);

      expect(() => {
        entity.assertAttemptOwnership("different-uuid", 42);
      }).not.toThrow();
    });

    it("assertAttemptOwnership throws AuthorizationError on owner mismatch", () => {
      const entity = new QuizAttemptEntity(101, "tenant-alpha", sampleMetadata);

      expect(() => {
        entity.assertAttemptOwnership("intruder-uuid", 999);
      }).toThrowError(AuthorizationError);
    });
  });

  describe("QuizAttemptMapper", () => {
    it("maps raw Moodle attempt to entity and DTO", () => {
      const raw: RawMoodleAttempt = {
        id: 202,
        quiz: 12,
        userid: 88,
        attempt: 2,
        sumgrades: 85,
        timestart: 1700001000,
        timefinish: 1700004600,
        timemodified: 1700004600,
        state: "finished",
        currentpage: 1,
      };

      const entity = QuizAttemptMapper.toEntity(
        raw,
        "tenant-alpha",
        "student-user-88",
      );

      expect(entity.id).toBe(202);
      expect(entity.quizId).toBe(12);
      expect(entity.userId).toBe("student-user-88");
      expect(entity.moodleUserId).toBe(88);
      expect(entity.attemptNumber).toBe(2);
      expect(entity.state).toBe("FINISHED");
      expect(entity.isFinished()).toBe(true);
      expect(entity.sumGrades).toBe(85);

      const dto = QuizAttemptMapper.toDto(entity);
      expect(dto.id).toBe(202);
      expect(dto.state).toBe("FINISHED");
      expect(dto.sumGrades).toBe(85);
    });

    it("maps questions correctly with toQuestionDto", () => {
      const rawQuestion = {
        slot: 1,
        type: "multichoice",
        page: 0,
        html: "<p>Question 1</p>",
        sequencecheck: 1,
        lastactiontime: 1700000000,
        hasautosaved: true,
        flagged: false,
        number: 1,
        state: "todo",
        status: "Not answered",
        maxmark: 2,
        mark: 1.5,
      };

      const questionDto = QuizAttemptMapper.toQuestionDto(rawQuestion);
      expect(questionDto.slot).toBe(1);
      expect(questionDto.type).toBe("multichoice");
      expect(questionDto.mark).toBe(1.5);
      expect(questionDto.hasAutoSaved).toBe(true);
    });

    it("handles toMoodleAnswerPayload with empty or undefined input", () => {
      expect(QuizAttemptMapper.toMoodleAnswerPayload(undefined)).toEqual([]);
      expect(QuizAttemptMapper.toMoodleAnswerPayload([])).toEqual([]);
      expect(QuizAttemptMapper.toMoodleAnswerPayload({})).toEqual([]);
    });
  });
});
