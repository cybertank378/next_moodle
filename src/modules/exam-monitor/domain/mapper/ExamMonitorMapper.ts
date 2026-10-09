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
        timeCreated: p.timecreated,
        timeModified: p.timemodified,
        timeLimit: p.timelimit,
        timeRemaining: p.timeremaining,
        isLocked: p.islocked,
      })),
      totalActive: moodleData.totalactive || 0,
      totalFinished: moodleData.totalfinished || 0,
    };
  }
}
