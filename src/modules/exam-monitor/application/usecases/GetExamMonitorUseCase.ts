import type { CurrentActor } from "@/core/auth/CurrentActor";
import type { Result } from "@/core/base/Result";
import { authorizeExamMonitorOperation } from "@/modules/exam-monitor/application/services/ExamMonitorAuthorizationService";
import type {
  ExamMonitorRequestDto,
  ExamMonitorResponseDto,
} from "@/modules/exam-monitor/domain/dto/ExamMonitorDto";
import type { ExamMonitorRepositoryInterface } from "@/modules/exam-monitor/domain/interfaces/ExamMonitorRepositoryInterface";

export class GetExamMonitorUseCase {
  constructor(private readonly repo: ExamMonitorRepositoryInterface) {}

  async execute(
    actor: CurrentActor,
    req: ExamMonitorRequestDto,
  ): Promise<Result<ExamMonitorResponseDto>> {
    try {
      authorizeExamMonitorOperation(actor, req.tenantId, "read");
      return await this.repo.getExamMonitor(req);
    } catch (error) {
      throw error;
    }
  }
}
