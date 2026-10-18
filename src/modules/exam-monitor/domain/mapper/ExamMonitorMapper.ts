import type { ExamMonitorResponseDto } from "@/modules/exam-monitor/domain/dto/ExamMonitorDto";

export class ExamMonitorMapper {
  static toResponseDto(moodleData: any): ExamMonitorResponseDto {
    return {
      quizId: moodleData.quizid,
      participants: (moodleData.participants || []).map((p: any) => ({
        attemptId: p.attemptid,
        userId: p.userid,
        fullname: p.fullname,
        state: p.state,
        timeCreated: p.timecreated ?? p.timestart ?? 0,
        timeModified: p.timemodified ?? p.timefinish ?? 0,
        timeLimit: p.timelimit ?? p.timeleft_seconds ?? 0,
        timeRemaining: p.timeremaining ?? p.timeleft_seconds,
        isLocked:
          p.islocked !== undefined ? Boolean(p.islocked) : Boolean(p.is_locked),
      })),
      totalActive:
        moodleData.totalactive ?? moodleData.counters?.in_progress ?? 0,
      totalFinished:
        moodleData.totalfinished ?? moodleData.counters?.finished ?? 0,
    };
  }
}
