import type { ListEnrolmentsQueryDto } from "../../domain/dto/EnrolmentRequestDto";
import type { EnrolmentListResponseDto } from "../../domain/dto/EnrolmentResponseDto";
import type { EnrolmentRepositoryInterface } from "../../domain/interfaces/EnrolmentRepositoryInterface";

export class ListEnrolmentsUseCase {
  constructor(private readonly repository: EnrolmentRepositoryInterface) {}

  async execute(input: {
    tenantId: string;
    query: ListEnrolmentsQueryDto;
  }): Promise<EnrolmentListResponseDto> {
    return this.repository.getCourseEnrolments(input);
  }
}
