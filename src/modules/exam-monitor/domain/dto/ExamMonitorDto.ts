export interface ExamMonitorRequestDto {
  tenantId: string;
  quizId: number;
}

export interface ExamMonitorActionRequestDto {
  tenantId: string;
  attemptId: number;
}

export interface ExtendAttemptTimeRequestDto
  extends ExamMonitorActionRequestDto {
  extraTimeMinutes: number;
}

export interface ExamMonitorParticipantDto {
  attemptId: number;
  userId: number;
  fullname: string;
  state: "inprogress" | "finished" | "abandoned" | "overdue";
  timeCreated: number;
  timeModified: number;
  timeLimit: number;
  timeRemaining?: number;
  isLocked: boolean;
}

export interface ExamMonitorResponseDto {
  quizId: number;
  participants: ExamMonitorParticipantDto[];
  totalActive: number;
  totalFinished: number;
}
