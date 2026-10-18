import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { UnenrolUserRequestDto } from "@/modules/enrolment/domain/dto/EnrolmentRequestDto";
import type { EnrolmentRepositoryInterface } from "@/modules/enrolment/domain/interfaces/EnrolmentRepositoryInterface";

export interface UnenrolUsersInput {
  tenantId: string;
  enrolments: UnenrolUserRequestDto[];
}

export class UnenrolUsersUseCase extends BaseUseCase<UnenrolUsersInput, boolean> {
  constructor(private readonly repository: EnrolmentRepositoryInterface) {
    super();
  }

  async handle(input: UnenrolUsersInput): Promise<boolean> {
    return this.repository.unenrolUsers(input);
  }
}

