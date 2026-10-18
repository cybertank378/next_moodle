import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import type { Result } from "@/core/base/Result";
import { authorizeExamMonitorOperation } from "@/modules/exam-monitor/application/services/ExamMonitorAuthorizationService";
import type { ExtendAttemptTimeRequestDto } from "@/modules/exam-monitor/domain/dto/ExamMonitorDto";
import type { ExamMonitorRepositoryInterface } from "@/modules/exam-monitor/domain/interfaces/ExamMonitorRepositoryInterface";

export interface ExtendTimeInput {
  actor: CurrentActor;
  req: ExtendAttemptTimeRequestDto;
}

export class ExtendTimeUseCase extends BaseUseCase<ExtendTimeInput, Result<void>> {
  constructor(private readonly repo: ExamMonitorRepositoryInterface) {
    super();
  }

  override execute(input: ExtendTimeInput): Promise<Result<void>>;
  override execute(
    actor: CurrentActor,
    req: ExtendAttemptTimeRequestDto,
  ): Promise<Result<void>>;
  override async execute(
    inputOrActor: ExtendTimeInput | CurrentActor,
    maybeReq?: ExtendAttemptTimeRequestDto,
  ): Promise<Result<void>> {
    const input: ExtendTimeInput =
      "req" in inputOrActor && "actor" in inputOrActor
        ? (inputOrActor as ExtendTimeInput)
        : { actor: inputOrActor as CurrentActor, req: maybeReq! };
    return this.handle(input);
  }

  async handle(input: ExtendTimeInput): Promise<Result<void>> {
    authorizeExamMonitorOperation(input.actor, input.req.tenantId, "action");
    return this.repo.extendAttemptTime(input.req);
  }
}

