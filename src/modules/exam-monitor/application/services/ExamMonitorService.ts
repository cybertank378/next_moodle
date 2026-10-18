import { BaseService } from "@/core/base/BaseService";
import type { Result } from "@/core/base/Result";
import {
  ExtendTimeUseCase,
  type ExtendTimeInput,
} from "@/modules/exam-monitor/application/usecases/ExtendTimeUseCase";
import {
  ForceFinishAttemptUseCase,
  type ForceFinishAttemptInput,
} from "@/modules/exam-monitor/application/usecases/ForceFinishAttemptUseCase";
import {
  GetExamMonitorUseCase,
  type GetExamMonitorInput,
} from "@/modules/exam-monitor/application/usecases/GetExamMonitorUseCase";
import {
  LockAttemptUseCase,
  type LockAttemptInput,
} from "@/modules/exam-monitor/application/usecases/LockAttemptUseCase";
import {
  UnlockAttemptUseCase,
  type UnlockAttemptInput,
} from "@/modules/exam-monitor/application/usecases/UnlockAttemptUseCase";
import type { ExamMonitorResponseDto } from "@/modules/exam-monitor/domain/dto/ExamMonitorDto";
import type { ExamMonitorRepositoryInterface } from "@/modules/exam-monitor/domain/interfaces/ExamMonitorRepositoryInterface";

/* ============================================================
 * EXAM MONITOR SERVICE
 * ============================================================
 *
 * Responsibility:
 * - Application Facade
 * - UseCase Orchestrator
 * - Transaction Boundary
 * - Exam Monitor Workflow Coordinator
 * - Thin Application Entry Point
 *
 * NOT:
 * - Business Logic Layer
 * - Repository Wrapper
 * - Database Layer
 * ============================================================
 */

export class ExamMonitorService extends BaseService {
  private readonly getExamMonitorUseCase: GetExamMonitorUseCase;
  private readonly extendTimeUseCase: ExtendTimeUseCase;
  private readonly forceFinishAttemptUseCase: ForceFinishAttemptUseCase;
  private readonly lockAttemptUseCase: LockAttemptUseCase;
  private readonly unlockAttemptUseCase: UnlockAttemptUseCase;

  constructor(repo: ExamMonitorRepositoryInterface) {
    super();

    this.getExamMonitorUseCase = new GetExamMonitorUseCase(repo);
    this.extendTimeUseCase = new ExtendTimeUseCase(repo);
    this.forceFinishAttemptUseCase = new ForceFinishAttemptUseCase(repo);
    this.lockAttemptUseCase = new LockAttemptUseCase(repo);
    this.unlockAttemptUseCase = new UnlockAttemptUseCase(repo);
  }

  getExamMonitor(
    input: GetExamMonitorInput,
  ): Promise<Result<ExamMonitorResponseDto>> {
    return this.execute(() => this.getExamMonitorUseCase.execute(input));
  }

  extendTime(input: ExtendTimeInput): Promise<Result<void>> {
    return this.execute(() => this.extendTimeUseCase.execute(input));
  }

  forceFinishAttempt(
    input: ForceFinishAttemptInput,
  ): Promise<Result<void>> {
    return this.execute(() => this.forceFinishAttemptUseCase.execute(input));
  }

  lockAttempt(input: LockAttemptInput): Promise<Result<void>> {
    return this.execute(() => this.lockAttemptUseCase.execute(input));
  }

  unlockAttempt(input: UnlockAttemptInput): Promise<Result<void>> {
    return this.execute(() => this.unlockAttemptUseCase.execute(input));
  }
}

