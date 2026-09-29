import type { EnrolUserRequestDto } from "../../domain/dto/EnrolmentRequestDto";
import type { EnrolmentRepositoryInterface } from "../../domain/interfaces/EnrolmentRepositoryInterface";

export class EnrolUsersUseCase {
  constructor(private readonly repository: EnrolmentRepositoryInterface) {}

  async execute(input: {
    tenantId: string;
    enrolments: EnrolUserRequestDto[];
  }): Promise<boolean> {
    return this.repository.enrolUsers(input);
  }
}
