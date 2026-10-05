import type { Result } from "@/core/base/Result";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import type { ExamMonitorRepositoryInterface } from "@/modules/exam-monitor/domain/interfaces/ExamMonitorRepositoryInterface";
import type { ExamMonitorActionRequestDto } from "@/modules/exam-monitor/domain/dto/ExamMonitorDto";
import { authorizeExamMonitorOperation } from "@/modules/exam-monitor/application/services/ExamMonitorAuthorizationService";

export class UnlockAttemptUseCase {
  constructor(private readonly repo: ExamMonitorRepositoryInterface) {}

  async execute(
    actor: CurrentActor,
    req: ExamMonitorActionRequestDto,
  ): Promise<Result<void>> {
    try {
      authorizeExamMonitorOperation(actor, req.tenantId, "action");
      return await this.repo.unlockAttempt(req);
    } catch (error) {
      throw error;
    }
  }
}
