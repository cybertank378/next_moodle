import type { MoodleClient } from "@/core/moodle/types";
import type { AssignmentQueryDTO } from "@/modules/assignment/domain/dto/AssignmentRequestDTO";
import type { AssignmentEntity } from "@/modules/assignment/domain/entity/AssignmentEntity";

export interface StudentAssignmentQueryOptions {
  tenantId: string;
  moodleUserId: number;
  query?: AssignmentQueryDTO;
  client: MoodleClient;
}

export interface AssignmentRepositoryInterface {
  getStudentAssignments(options: StudentAssignmentQueryOptions): Promise<{
    items: AssignmentEntity[];
    backendBlocked: boolean;
    backendBlockedReason?: string;
  }>;

  getAssignmentById(options: {
    tenantId: string;
    moodleUserId: number;
    assignmentId: string;
    client: MoodleClient;
  }): Promise<AssignmentEntity | null>;
}
