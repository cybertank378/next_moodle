import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import type { Result } from "@/core/base/Result";
import { authorizeExamMonitorOperation } from "@/modules/exam-monitor/application/services/ExamMonitorAuthorizationService";
import type { ExamMonitorActionRequestDto } from "@/modules/exam-monitor/domain/dto/ExamMonitorDto";
import type { ExamMonitorRepositoryInterface } from "@/modules/exam-monitor/domain/interfaces/ExamMonitorRepositoryInterface";

export interface LockAttemptInput {
  actor: CurrentActor;
  req: ExamMonitorActionRequestDto;
}

export class LockAttemptUseCase extends BaseUseCase<
  LockAttemptInput,
  Result<void>
> {
  constructor(private readonly repo: ExamMonitorRepositoryInterface) {
    super();
  }

  override execute(input: LockAttemptInput): Promise<Result<void>>;
  override execute(
    actor: CurrentActor,
    req: ExamMonitorActionRequestDto,
  ): Promise<Result<void>>;
  override async execute(
    inputOrActor: LockAttemptInput | CurrentActor,
    maybeReq?: ExamMonitorActionRequestDto,
  ): Promise<Result<void>> {
    const input: LockAttemptInput =
      "req" in inputOrActor && "actor" in inputOrActor
        ? (inputOrActor as LockAttemptInput)
        : { actor: inputOrActor as CurrentActor, req: maybeReq! };
    return this.handle(input);
  }

  async handle(input: LockAttemptInput): Promise<Result<void>> {
    authorizeExamMonitorOperation(input.actor, input.req.tenantId, "action");
    return this.repo.lockAttempt(input.req);
  }
}

