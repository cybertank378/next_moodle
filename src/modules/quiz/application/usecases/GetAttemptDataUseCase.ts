import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { Permission } from "@/core/rbac/Permission";
import type { QuizAttemptDataResponseDto } from "../../domain/dto/QuizAttemptResponseDto";
import type { QuizAttemptRepositoryInterface } from "../../domain/interfaces/QuizAttemptRepositoryInterface";
import { authorizeAttemptOperation } from "../services/QuizAttemptAuthorizationService";

export interface GetAttemptDataInput {
  actor: AuthorizationActor;
  studentMoodleToken: string;
  attemptId: number;
  page: number;
}

export class GetAttemptDataUseCase {
  constructor(private readonly repository: QuizAttemptRepositoryInterface) {}

  public async execute(
    input: GetAttemptDataInput,
  ): Promise<QuizAttemptDataResponseDto> {
    const tenantId = authorizeAttemptOperation(
      input.actor,
      Permission.ATTEMPT_READ_OWN,
    );

    const data = await this.repository.getAttemptData(
      tenantId,
      input.studentMoodleToken,
      input.attemptId,
      input.page,
      input.actor.id,
    );

    // Ownership check on returned attempt
    if (
      data.attempt &&
      data.attempt.userId !== input.actor.id &&
      (!input.actor.moodleUserId ||
        data.attempt.moodleUserId !== input.actor.moodleUserId)
    ) {
      throw new AuthorizationError(
        "Akses ditolak: mahasiswa hanya dapat mengakses attempt miliknya sendiri.",
      );
    }

    return data;
  }
}
