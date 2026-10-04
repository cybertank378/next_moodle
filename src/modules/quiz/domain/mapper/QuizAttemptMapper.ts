import type { AnswerInputPayload } from "../dto/QuizAttemptRequestDto";
import type {
  QuizAttemptQuestionDto,
  QuizAttemptResponseDto,
} from "../dto/QuizAttemptResponseDto";
import { QuizAttemptEntity } from "../entity/QuizAttemptEntity";
import type {
  MoodleAnswerPayloadItem,
  QuizAttemptStatus,
  RawMoodleAttempt,
  RawMoodleAttemptQuestion,
  StructuredQuestionAnswer,
} from "../types/QuizAttemptTypes";

export class QuizAttemptMapper {
  public static mapMoodleState(stateStr: string): QuizAttemptStatus {
    const normalized = stateStr.toLowerCase();
    if (normalized === "finished") {
      return "FINISHED";
    }
    if (normalized === "abandoned") {
      return "ABANDONED";
    }
    return "IN_PROGRESS";
  }

  public static toEntity(
    raw: RawMoodleAttempt,
    tenantId: string,
    userId?: string,
  ): QuizAttemptEntity {
    return new QuizAttemptEntity(raw.id, tenantId, {
      id: raw.id,
      quizId: raw.quiz,
      userId: userId ?? String(raw.userid),
      moodleUserId: raw.userid,
      attemptNumber: raw.attempt,
      state: QuizAttemptMapper.mapMoodleState(raw.state),
      sumGrades: raw.sumgrades ?? null,

      timeStart: raw.timestart,
      timeFinish: raw.timefinish,
      timeModified: raw.timemodified,
      currentPage: raw.currentpage ?? 0,
    });
  }

  public static toDto(entity: QuizAttemptEntity): QuizAttemptResponseDto {
    return {
      id: entity.id,
      quizId: entity.quizId,
      userId: entity.userId,
      moodleUserId: entity.moodleUserId,
      attemptNumber: entity.attemptNumber,
      state: entity.state,
      sumGrades: entity.sumGrades,
      timeStart: entity.timeStart,
      timeFinish: entity.timeFinish,
      timeModified: entity.timeModified,
      currentPage: entity.currentPage,
    };
  }

  public static toQuestionDto(
    raw: RawMoodleAttemptQuestion,
  ): QuizAttemptQuestionDto {
    return {
      slot: raw.slot,
      type: raw.type,
      page: raw.page,
      html: raw.html,
      sequenceCheck: raw.sequencecheck,
      lastActionTime: raw.lastactiontime,
      hasAutoSaved: raw.hasautosaved,
      flagged: raw.flagged,
      number: raw.number,
      state: raw.state,
      status: raw.status,
      maxMark: raw.maxmark,
      mark:
        raw.mark !== undefined && raw.mark !== null ? Number(raw.mark) : null,
    };
  }

  /**
   * Formats various answer input structures into Moodle's name-value pair array.
   */
  public static toMoodleAnswerPayload(
    answers?: AnswerInputPayload,
  ): MoodleAnswerPayloadItem[] {
    if (!answers) {
      return [];
    }

    if (Array.isArray(answers)) {
      const result: MoodleAnswerPayloadItem[] = [];

      for (const item of answers) {
        if ("slot" in item) {
          const structured = item as StructuredQuestionAnswer;
          result.push({
            name: `q${structured.slot}:1_answer`,
            value: String(structured.answer),
          });
          if (structured.sequenceCheck !== undefined) {
            result.push({
              name: `q${structured.slot}:1_:sequencecheck`,
              value: String(structured.sequenceCheck),
            });
          }
        } else if ("name" in item && "value" in item) {
          result.push({
            name: item.name,
            value: String(item.value),
          });
        }
      }

      return result;
    }

    // Key-value dictionary
    return Object.entries(answers).map(([name, value]) => ({
      name,
      value: String(value),
    }));
  }
}
