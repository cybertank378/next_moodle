import type { Result } from "@/core/base/Result";
import type {
  ExamMonitorActionRequestDto,
  ExamMonitorRequestDto,
  ExamMonitorResponseDto,
  ExtendAttemptTimeRequestDto,
} from "../dto/ExamMonitorDto";

export interface ExamMonitorRepositoryInterface {
  getExamMonitor(
    req: ExamMonitorRequestDto,
  ): Promise<Result<ExamMonitorResponseDto>>;

  lockAttempt(req: ExamMonitorActionRequestDto): Promise<Result<void>>;

  unlockAttempt(req: ExamMonitorActionRequestDto): Promise<Result<void>>;

  forceFinishAttempt(req: ExamMonitorActionRequestDto): Promise<Result<void>>;

  extendAttemptTime(req: ExtendAttemptTimeRequestDto): Promise<Result<void>>;
}
