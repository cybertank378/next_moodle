import { describe, expect, it } from "vitest";
import { QuizEntity } from "../../domain/entity/QuizEntity";
import { QuizMapper } from "../../domain/mapper/QuizMapper";
import type { RawMoodleQuiz } from "../../domain/types/QuizTypes";

describe("QuizEntity & QuizMapper", () => {
  const rawQuiz: RawMoodleQuiz = {
    id: 101,
    course: 5,
    coursemodule: 12,
    name: "Ujian Tengah Semester Fisika",
    intro: "<p>Kerjakan dengan jujur.</p>",
    timeopen: 1700000000,
    timeclose: 1700007200,
    timelimit: 5400,
    attempts: 2,
    grade: 100,
    visible: 1,
  };

  it("maps raw Moodle quiz to domain QuizEntity correctly", () => {
    const entity = QuizMapper.toEntity(rawQuiz, "tenant-1");

    expect(entity.id).toBe(101);
    expect(entity.tenantId).toBe("tenant-1");
    expect(entity.courseId).toBe(5);
    expect(entity.courseModuleId).toBe(12);
    expect(entity.name).toBe("Ujian Tengah Semester Fisika");
    expect(entity.timeOpen).toBe(1700000000);
    expect(entity.timeClose).toBe(1700007200);
    expect(entity.timeLimitSeconds).toBe(5400);
    expect(entity.maxAttempts).toBe(2);
    expect(entity.grade).toBe(100);
    expect(entity.isVisible).toBe(true);
  });

  it("evaluates access status as UPCOMING when current time is before timeopen", () => {
    const entity = QuizMapper.toEntity(rawQuiz, "tenant-1");
    const currentTime = 1699999000; // before timeopen

    const evalResult = entity.evaluateAccess(currentTime);
    expect(evalResult.isAllowed).toBe(false);
    expect(evalResult.status).toBe("UPCOMING");
  });

  it("evaluates access status as OPEN when current time is within time window", () => {
    const entity = QuizMapper.toEntity(rawQuiz, "tenant-1");
    const currentTime = 1700003600; // in the middle

    const evalResult = entity.evaluateAccess(currentTime);
    expect(evalResult.isAllowed).toBe(true);
    expect(evalResult.status).toBe("OPEN");
    expect(evalResult.reasons).toHaveLength(0);
  });

  it("evaluates access status as CLOSED when current time is after timeclose", () => {
    const entity = QuizMapper.toEntity(rawQuiz, "tenant-1");
    const currentTime = 1700008000; // after timeclose

    const evalResult = entity.evaluateAccess(currentTime);
    expect(evalResult.isAllowed).toBe(false);
    expect(evalResult.status).toBe("CLOSED");
    expect(evalResult.reasons[0]).toMatch(/berakhir|tutup/i);
  });

  it("maps entity to Summary and Access DTOs correctly", () => {
    const entity = QuizMapper.toEntity(rawQuiz, "tenant-1");
    const summary = QuizMapper.toSummaryDTO(entity, 1700003600);

    expect(summary.id).toBe(101);
    expect(summary.status).toBe("OPEN");
    expect(summary.timeLimitSeconds).toBe(5400);

    const access = QuizMapper.toAccessDTO(
      entity,
      entity.evaluateAccess(1700003600),
    );
    expect(access.quizId).toBe(101);
    expect(access.canAttempt).toBe(true);
    expect(access.status).toBe("OPEN");
  });
});
