import type { UnenrolUserRequestDto } from "../../domain/dto/EnrolmentRequestDto";
import type { EnrolmentRepositoryInterface } from "../../domain/interfaces/EnrolmentRepositoryInterface";

export class UnenrolUsersUseCase {
  constructor(private readonly repository: EnrolmentRepositoryInterface) {}

  async execute(input: {
    tenantId: string;
    enrolments: UnenrolUserRequestDto[];
  }): Promise<boolean> {
    return this.repository.unenrolUsers(input);
  }
}
