import { Result } from "@/core/base/Result";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { ValidationError } from "@/core/errors/ValidationError";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { AppRole } from "@/core/rbac/AppRole";
import type {
  GetAssignmentDetailInput,
  GetStudentAssignmentsInput,
  SubmitAssignmentInput,
} from "@/modules/assignment/domain/dto/AssignmentRequestDTO";
import type {
  AssignmentItemDTO,
  AssignmentListResponseDTO,
} from "@/modules/assignment/domain/dto/AssignmentResponseDTO";
import type { AssignmentRepositoryInterface } from "@/modules/assignment/domain/interfaces/AssignmentRepositoryInterface";
import { AssignmentMapper } from "@/modules/assignment/domain/mapper/AssignmentMapper";

export class GetStudentAssignmentsUseCase {
  constructor(
    private readonly assignmentRepo: AssignmentRepositoryInterface,
    private readonly clientFactory: MoodleClientFactory,
  ) {}

  async execute(
    input: GetStudentAssignmentsInput,
  ): Promise<Result<AssignmentListResponseDTO, Error>> {
    const { actor, query, moodleToken } = input;

    if (!actor.tenantId) {
      return Result.fail(
        new ValidationError(
          "Tenant ID wajib disertakan untuk mengakses tugas.",
        ),
      );
    }

    if (actor.role !== AppRole.STUDENT) {
      return Result.fail(
        new ForbiddenError(
          "Hanya siswa yang berhak mengakses penugasan siswa langsung.",
        ),
      );
    }

    if (!actor.moodleUserId) {
      return Result.fail(
        new ValidationError("Identitas Moodle siswa tidak ditemukan."),
      );
    }

    if (!moodleToken) {
      return Result.fail(
        new UnauthorizedError("Token Moodle siswa wajib disertakan."),
      );
    }

    try {
      const client = this.clientFactory.createStudentClient(
        actor.tenantId,
        moodleToken,
      );

      const result = await this.assignmentRepo.getStudentAssignments({
        tenantId: actor.tenantId,
        moodleUserId: actor.moodleUserId,
        query,
        client,
      });

      const items: AssignmentItemDTO[] = result.items.map((e) =>
        AssignmentMapper.toDTO(e),
      );

      return Result.ok({
        items,
        meta: {
          total: items.length,
          pendingSubmission: items.filter(
            (i) => i.status === "NEW" || i.status === "DRAFT",
          ).length,
          submitted: items.filter((i) => i.status === "SUBMITTED").length,
          graded: items.filter((i) => i.status === "GRADED").length,
          backendBlocked: result.backendBlocked,
          backendBlockedReason: result.backendBlockedReason,
        },
      });
    } catch (err: any) {
      return Result.fail(
        new ValidationError(
          err.message || "Gagal memuat daftar penugasan siswa.",
        ),
      );
    }
  }
}

export class GetAssignmentDetailUseCase {
  constructor(
    private readonly assignmentRepo: AssignmentRepositoryInterface,
    private readonly clientFactory: MoodleClientFactory,
  ) {}

  async execute(
    input: GetAssignmentDetailInput,
  ): Promise<Result<AssignmentItemDTO | null, Error>> {
    const { actor, assignmentId, moodleToken } = input;

    if (!actor.tenantId || !actor.moodleUserId) {
      return Result.fail(
        new ValidationError("Tenant ID dan Moodle User ID wajib disertakan."),
      );
    }

    if (!moodleToken) {
      return Result.fail(
        new UnauthorizedError("Token Moodle siswa wajib disertakan."),
      );
    }

    try {
      const client = this.clientFactory.createStudentClient(
        actor.tenantId,
        moodleToken,
      );

      const entity = await this.assignmentRepo.getAssignmentById({
        tenantId: actor.tenantId,
        moodleUserId: actor.moodleUserId,
        assignmentId,
        client,
      });

      if (!entity) return Result.ok(null);

      return Result.ok(AssignmentMapper.toDTO(entity));
    } catch (err: any) {
      return Result.fail(
        new ValidationError(err.message || "Gagal memuat detail tugas."),
      );
    }
  }
}

export class SubmitAssignmentUseCase {
  async execute(
    _input: SubmitAssignmentInput,
  ): Promise<Result<AssignmentItemDTO, Error>> {
    return Result.fail(
      new ValidationError(
        "Pengiriman tugas saat ini belum tersedia karena modul mod_assign belum terdaftar pada kontrak backend Moodle resmi (backend-contract-blocked).",
      ),
    );
  }
}
