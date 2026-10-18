import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { ListEnrolmentsQueryDto } from "@/modules/enrolment/domain/dto/EnrolmentRequestDto";
import type { EnrolmentListResponseDto } from "@/modules/enrolment/domain/dto/EnrolmentResponseDto";
import type { EnrolmentRepositoryInterface } from "@/modules/enrolment/domain/interfaces/EnrolmentRepositoryInterface";

export interface ListEnrolmentsInput {
  tenantId: string;
  query: ListEnrolmentsQueryDto;
}

export class ListEnrolmentsUseCase extends BaseUseCase<
  ListEnrolmentsInput,
  EnrolmentListResponseDto
> {
  constructor(private readonly repository: EnrolmentRepositoryInterface) {
    super();
  }

  async handle(input: ListEnrolmentsInput): Promise<EnrolmentListResponseDto> {
    return this.repository.getCourseEnrolments(input);
  }
}

