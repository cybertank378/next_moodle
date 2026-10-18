import type {
  AssignmentFileDTO,
  AssignmentGradingStatus,
  AssignmentSubmissionStatus,
  AssignmentSubmissionType,
} from "@/modules/assignment/domain/types/AssignmentTypes";

export interface AssignmentItemDTO {
  id: string;
  courseId: number;
  courseName?: string;
  name: string;
  intro?: string;
  dueDate?: number;
  cutoffDate?: number;
  allowSubmissionsFromDate?: number;
  submissionType: AssignmentSubmissionType;
  maxFilesAllowed?: number;
  maxUploadBytes?: number;
  status: AssignmentSubmissionStatus;
  gradingStatus: AssignmentGradingStatus;
  grade?: number;
  maxGrade?: number;
  feedback?: string;
  submittedAt?: string;
  onlineText?: string;
  files?: AssignmentFileDTO[];
  timeRemainingSeconds?: number;
  isOverdue?: boolean;
  canSubmit?: boolean;
}

export interface AssignmentSummaryMetaDTO {
  total: number;
  pendingSubmission: number;
  submitted: number;
  graded: number;
  backendBlocked?: boolean;
  backendBlockedReason?: string;
}

export interface AssignmentListResponseDTO {
  items: AssignmentItemDTO[];
  meta: AssignmentSummaryMetaDTO;
}
