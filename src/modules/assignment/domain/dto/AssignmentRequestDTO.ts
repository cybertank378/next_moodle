import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type { AssignmentSubmissionStatus } from "@/modules/assignment/domain/types/AssignmentTypes";

export interface AssignmentQueryDTO {
  courseId?: number;
  status?: AssignmentSubmissionStatus;
  search?: string;
}

export interface GetStudentAssignmentsInput {
  actor: AuthorizationActor;
  query?: AssignmentQueryDTO;
  moodleToken?: string;
}

export interface GetAssignmentDetailInput {
  actor: AuthorizationActor;
  assignmentId: string;
  moodleToken?: string;
}

export interface SubmitAssignmentInput {
  actor: AuthorizationActor;
  assignmentId: string;
  data: {
    onlineText?: string;
    fileIds?: string[];
  };
  moodleToken?: string;
}
