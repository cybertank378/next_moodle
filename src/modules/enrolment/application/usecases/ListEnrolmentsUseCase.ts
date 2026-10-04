import type { ListEnrolmentsQueryDto } from "@/modules/enrolment/domain/dto/EnrolmentRequestDto";
import type { EnrolmentListResponseDto } from "@/modules/enrolment/domain/dto/EnrolmentResponseDto";
import type { EnrolmentRepositoryInterface } from "@/modules/enrolment/domain/interfaces/EnrolmentRepositoryInterface";

export class ListEnrolmentsUseCase {
  constructor(private readonly repository: EnrolmentRepositoryInterface) {}

  async execute(input: {
    tenantId: string;
    query: ListEnrolmentsQueryDto;
  }): Promise<EnrolmentListResponseDto> {
    return this.repository.getCourseEnrolments(input);
  }
}
