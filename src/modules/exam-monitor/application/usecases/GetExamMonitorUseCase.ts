import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import type { Result } from "@/core/base/Result";
import { authorizeExamMonitorOperation } from "@/modules/exam-monitor/application/services/ExamMonitorAuthorizationService";
import type {
  ExamMonitorRequestDto,
  ExamMonitorResponseDto,
} from "@/modules/exam-monitor/domain/dto/ExamMonitorDto";
import type { ExamMonitorRepositoryInterface } from "@/modules/exam-monitor/domain/interfaces/ExamMonitorRepositoryInterface";

export interface GetExamMonitorInput {
  actor: CurrentActor;
  req: ExamMonitorRequestDto;
}

export class GetExamMonitorUseCase extends BaseUseCase<
  GetExamMonitorInput,
  Result<ExamMonitorResponseDto>
> {
  constructor(private readonly repo: ExamMonitorRepositoryInterface) {
    super();
  }

  override execute(
    input: GetExamMonitorInput,
  ): Promise<Result<ExamMonitorResponseDto>>;
  override execute(
    actor: CurrentActor,
    req: ExamMonitorRequestDto,
  ): Promise<Result<ExamMonitorResponseDto>>;
  override async execute(
    inputOrActor: GetExamMonitorInput | CurrentActor,
    maybeReq?: ExamMonitorRequestDto,
  ): Promise<Result<ExamMonitorResponseDto>> {
    const input: GetExamMonitorInput =
      "req" in inputOrActor && "actor" in inputOrActor
        ? (inputOrActor as GetExamMonitorInput)
        : { actor: inputOrActor as CurrentActor, req: maybeReq! };
    return this.handle(input);
  }

  async handle(
    input: GetExamMonitorInput,
  ): Promise<Result<ExamMonitorResponseDto>> {
    authorizeExamMonitorOperation(input.actor, input.req.tenantId, "read");
    return this.repo.getExamMonitor(input.req);
  }
}

