import { Result } from "@/core/base/Result";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { ValidationError } from "@/core/errors/ValidationError";
import { AppRole } from "@/core/rbac/AppRole";
import type {
  CancelScheduleInput,
  CreateScheduleInput,
  PublishScheduleInput,
  UpdateScheduleInput,
} from "@/modules/schedule/domain/dto/ScheduleRequestDTO";
import type { ScheduleSessionItemDTO } from "@/modules/schedule/domain/dto/ScheduleResponseDTO";

/**
 * Backend-contract-blocked use cases for Schedule mutations (Create, Update, Publish, Cancel).
 *
 * As mandated by AGENTS.md Section 4 & 4.1:
 * "The current plugin does not register custom functions for full timetable/class schedule lifecycle CRUD...
 * Therefore, a Next.js feature requiring create/update/delete/publish schedule must be treated as
 * backend-contract-blocked until an approved Moodle function is actually registered and tested.
 * Never invent the function name or bypass the plugin with direct SQL."
 */

export class CreateScheduleUseCase {
  async execute(
    input: CreateScheduleInput,
  ): Promise<Result<ScheduleSessionItemDTO, Error>> {
    if (input.actor.role === AppRole.STUDENT) {
      return Result.fail(
        new ForbiddenError("Siswa tidak memiliki izin untuk membuat jadwal."),
      );
    }
    return Result.fail(
      new ValidationError(
        "Fungsi pembuatan jadwal pelajaran langsung saat ini belum tersedia pada backend Moodle (backend-contract-blocked).",
      ),
    );
  }
}

export class UpdateScheduleUseCase {
  async execute(
    input: UpdateScheduleInput,
  ): Promise<Result<ScheduleSessionItemDTO, Error>> {
    if (input.actor.role === AppRole.STUDENT) {
      return Result.fail(
        new ForbiddenError("Siswa tidak memiliki izin untuk mengubah jadwal."),
      );
    }
    return Result.fail(
      new ValidationError(
        "Fungsi pembaruan jadwal pelajaran saat ini belum tersedia pada backend Moodle (backend-contract-blocked).",
      ),
    );
  }
}

export class PublishScheduleUseCase {
  async execute(
    input: PublishScheduleInput,
  ): Promise<Result<ScheduleSessionItemDTO, Error>> {
    if (input.actor.role === AppRole.STUDENT) {
      return Result.fail(
        new ForbiddenError(
          "Siswa tidak memiliki izin untuk mempublikasikan jadwal.",
        ),
      );
    }
    return Result.fail(
      new ValidationError(
        "Fungsi publikasi jadwal pelajaran saat ini belum tersedia pada backend Moodle (backend-contract-blocked).",
      ),
    );
  }
}

export class CancelScheduleUseCase {
  async execute(
    input: CancelScheduleInput,
  ): Promise<Result<ScheduleSessionItemDTO, Error>> {
    if (input.actor.role === AppRole.STUDENT) {
      return Result.fail(
        new ForbiddenError(
          "Siswa tidak memiliki izin untuk membatalkan jadwal.",
        ),
      );
    }
    return Result.fail(
      new ValidationError(
        "Fungsi pembatalan jadwal pelajaran saat ini belum tersedia pada backend Moodle (backend-contract-blocked).",
      ),
    );
  }
}
