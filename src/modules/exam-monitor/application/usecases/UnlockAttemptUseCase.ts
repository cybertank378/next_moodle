import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import type { Result } from "@/core/base/Result";
import { authorizeExamMonitorOperation } from "@/modules/exam-monitor/application/services/ExamMonitorAuthorizationService";
import type { ExamMonitorActionRequestDto } from "@/modules/exam-monitor/domain/dto/ExamMonitorDto";
import type { ExamMonitorRepositoryInterface } from "@/modules/exam-monitor/domain/interfaces/ExamMonitorRepositoryInterface";

export interface UnlockAttemptInput {
  actor: CurrentActor;
  req: ExamMonitorActionRequestDto;
}

export class UnlockAttemptUseCase extends BaseUseCase<
  UnlockAttemptInput,
  Result<void>
> {
  constructor(private readonly repo: ExamMonitorRepositoryInterface) {
    super();
  }

  override execute(input: UnlockAttemptInput): Promise<Result<void>>;
  override execute(
    actor: CurrentActor,
    req: ExamMonitorActionRequestDto,
  ): Promise<Result<void>>;
  override async execute(
    inputOrActor: UnlockAttemptInput | CurrentActor,
    maybeReq?: ExamMonitorActionRequestDto,
  ): Promise<Result<void>> {
    const input: UnlockAttemptInput =
      "req" in inputOrActor && "actor" in inputOrActor
        ? (inputOrActor as UnlockAttemptInput)
        : { actor: inputOrActor as CurrentActor, req: maybeReq! };
    return this.handle(input);
  }

  async handle(input: UnlockAttemptInput): Promise<Result<void>> {
    authorizeExamMonitorOperation(input.actor, input.req.tenantId, "action");
    return this.repo.unlockAttempt(input.req);
  }
}

