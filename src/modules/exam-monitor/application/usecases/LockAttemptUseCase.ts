import type { CurrentActor } from "@/core/auth/CurrentActor";
import type { Result } from "@/core/base/Result";
import { authorizeExamMonitorOperation } from "@/modules/exam-monitor/application/services/ExamMonitorAuthorizationService";
import type { ExamMonitorActionRequestDto } from "@/modules/exam-monitor/domain/dto/ExamMonitorDto";
import type { ExamMonitorRepositoryInterface } from "@/modules/exam-monitor/domain/interfaces/ExamMonitorRepositoryInterface";

export class LockAttemptUseCase {
  constructor(private readonly repo: ExamMonitorRepositoryInterface) {}

  async execute(
    actor: CurrentActor,
    req: ExamMonitorActionRequestDto,
  ): Promise<Result<void>> {
    try {
      authorizeExamMonitorOperation(actor, req.tenantId, "action");
      return await this.repo.lockAttempt(req);
    } catch (error) {
      throw error;
    }
  }
}
