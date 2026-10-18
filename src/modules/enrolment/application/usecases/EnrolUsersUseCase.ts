import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { EnrolUserRequestDto } from "@/modules/enrolment/domain/dto/EnrolmentRequestDto";
import type { EnrolmentRepositoryInterface } from "@/modules/enrolment/domain/interfaces/EnrolmentRepositoryInterface";

export interface EnrolUsersInput {
  tenantId: string;
  enrolments: EnrolUserRequestDto[];
}

export class EnrolUsersUseCase extends BaseUseCase<EnrolUsersInput, boolean> {
  constructor(private readonly repository: EnrolmentRepositoryInterface) {
    super();
  }

  async handle(input: EnrolUsersInput): Promise<boolean> {
    return this.repository.enrolUsers(input);
  }
}

