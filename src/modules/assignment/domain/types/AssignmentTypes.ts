export type AssignmentSubmissionType = "ONLINE_TEXT" | "FILE" | "BOTH";

export type AssignmentSubmissionStatus =
  | "NEW"
  | "DRAFT"
  | "SUBMITTED"
  | "GRADED"
  | "REOPENED";

export type AssignmentGradingStatus =
  | "NOT_GRADED"
  | "GRADED"
  | "RELEASED"
  | "HIDDEN";

export interface AssignmentFileDTO {
  id: string;
  filename: string;
  filesize: number;
  fileurl?: string;
  mimetype?: string;
  timemodified?: number;
}

export interface AssignmentItemProps {
  id: string;
  courseId: number;
  courseName?: string;
  name: string;
  intro?: string;
  dueDate?: number; // unix timestamp in seconds
  cutoffDate?: number; // unix timestamp in seconds
  allowSubmissionsFromDate?: number;
  submissionType: AssignmentSubmissionType;
  maxFilesAllowed?: number;
  maxUploadBytes?: number;
  status: AssignmentSubmissionStatus;
  gradingStatus: AssignmentGradingStatus;
  grade?: number;
  maxGrade?: number;
  feedback?: string;
  submittedAt?: string; // ISO-8601
  onlineText?: string;
  files?: AssignmentFileDTO[];
  timeRemainingSeconds?: number;
  isOverdue?: boolean;
  canSubmit?: boolean;
}
