import type { UnenrolUserRequestDto } from "@/modules/enrolment/domain/dto/EnrolmentRequestDto";
import type { EnrolmentRepositoryInterface } from "@/modules/enrolment/domain/interfaces/EnrolmentRepositoryInterface";

export class UnenrolUsersUseCase {
  constructor(private readonly repository: EnrolmentRepositoryInterface) {}

  async execute(input: {
    tenantId: string;
    enrolments: UnenrolUserRequestDto[];
  }): Promise<boolean> {
    return this.repository.unenrolUsers(input);
  }
}
