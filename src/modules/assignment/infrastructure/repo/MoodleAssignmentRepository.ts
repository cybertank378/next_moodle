import "server-only";

import type { AssignmentEntity } from "@/modules/assignment/domain/entity/AssignmentEntity";
import type {
  AssignmentRepositoryInterface,
  StudentAssignmentQueryOptions,
} from "@/modules/assignment/domain/interfaces/AssignmentRepositoryInterface";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";

export class MoodleAssignmentRepository
  implements AssignmentRepositoryInterface
{
  constructor(private readonly courseRepo: CourseRepositoryInterface) {}

  async getStudentAssignments(options: StudentAssignmentQueryOptions): Promise<{
    items: AssignmentEntity[];
    backendBlocked: boolean;
    backendBlockedReason?: string;
  }> {
    const { tenantId, moodleUserId, client } = options;

    // 1. Verify student courses
    const enrolledCourses = await this.courseRepo.getUserCourses({
      tenantId,
      moodleUserId,
      client,
    });

    if (enrolledCourses.length === 0) {
      return {
        items: [],
        backendBlocked: false,
      };
    }

    // 2. Authoritative check for mod_assign:
    // As documented in AGENTS.md Section 4.1, local_examapi alpha contract does NOT expose mod_assign_*
    // (e.g. mod_assign_get_assignments, mod_assign_save_submission).
    // We honestly report backend-contract-blocked status to protect academic integrity.
    return {
      items: [],
      backendBlocked: true,
      backendBlockedReason:
        "Layanan Moodle API (plugin local_examapi) untuk modul penugasan (mod_assign) saat ini belum terdaftar pada kontrak backend resmi.",
    };
  }

  async getAssignmentById(_options: {
    tenantId: string;
    moodleUserId: number;
    assignmentId: string;
    client: StudentAssignmentQueryOptions["client"];
  }): Promise<AssignmentEntity | null> {
    return null;
  }
}
