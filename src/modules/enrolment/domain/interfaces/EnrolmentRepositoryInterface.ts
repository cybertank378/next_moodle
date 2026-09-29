import type { MoodleClient } from "@/core/moodle/types";
import type {
  EnrolUserRequestDto,
  ListEnrolmentsQueryDto,
  UnenrolUserRequestDto,
} from "../dto/EnrolmentRequestDto";
import type { EnrolmentListResponseDto } from "../dto/EnrolmentResponseDto";

export interface EnrolmentRepositoryInterface {
  getCourseEnrolments(input: {
    tenantId: string;
    query: ListEnrolmentsQueryDto;
    client?: MoodleClient;
  }): Promise<EnrolmentListResponseDto>;

  enrolUsers(input: {
    tenantId: string;
    enrolments: EnrolUserRequestDto[];
    client?: MoodleClient;
  }): Promise<boolean>;

  unenrolUsers(input: {
    tenantId: string;
    enrolments: UnenrolUserRequestDto[];
    client?: MoodleClient;
  }): Promise<boolean>;
}
