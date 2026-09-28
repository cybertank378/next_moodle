import type {
  QuizAccessResponseDTO,
  QuizSummaryResponseDTO,
} from "../dto/QuizResponseDto";
import { QuizEntity } from "../entity/QuizEntity";
import type {
  QuizAccessRuleEvaluation,
  RawMoodleQuiz,
} from "../types/QuizTypes";

export class QuizMapper {
  public static toEntity(raw: RawMoodleQuiz, tenantId: string): QuizEntity {
    return new QuizEntity(raw.id, tenantId, {
      id: raw.id,
      courseId: raw.course,
      courseModuleId: raw.coursemodule,
      name: raw.name,
      intro: raw.intro ?? "",
      timeOpen: raw.timeopen ?? 0,
      timeClose: raw.timeclose ?? 0,
      timeLimitSeconds: raw.timelimit ?? 0,
      maxAttempts: raw.attempts ?? 0,
      grade: raw.grade ?? undefined,
      isVisible: raw.visible !== 0,
    });
  }

  public static toSummaryDTO(
    entity: QuizEntity,
    currentTime?: number,
  ): QuizSummaryResponseDTO {
    return {
      id: entity.id,
      courseId: entity.courseId,
      courseModuleId: entity.courseModuleId,
      name: entity.name,
      intro: entity.intro,
      timeOpen: entity.timeOpen,
      timeClose: entity.timeClose,
      timeLimitSeconds: entity.timeLimitSeconds,
      maxAttempts: entity.maxAttempts,
      grade: entity.grade,
      isVisible: entity.isVisible,
      status: entity.getStatus(currentTime),
    };
  }

  public static toAccessDTO(
    entity: QuizEntity,
    evaluation: QuizAccessRuleEvaluation,
  ): QuizAccessResponseDTO {
    return {
      quizId: entity.id,
      canAttempt: evaluation.isAllowed,
      status: evaluation.status,
      reasons: [...evaluation.reasons],
      timeOpen: entity.timeOpen,
      timeClose: entity.timeClose,
      timeLimitSeconds: entity.timeLimitSeconds,
    };
  }
}
