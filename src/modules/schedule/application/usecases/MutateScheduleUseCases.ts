import { Result } from "@/core/base/Result";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { ValidationError } from "@/core/errors/ValidationError";
import { AppRole } from "@/core/rbac/AppRole";
import type {
  CancelScheduleInput,
  CreateScheduleInput,
  PublishScheduleInput,
  UpdateScheduleInput,
} from "@/modules/schedule/domain/dto/ScheduleRequestDTO";
import type { ScheduleSessionItemDTO } from "@/modules/schedule/domain/dto/ScheduleResponseDTO";
import type { ScheduleRepositoryInterface } from "@/modules/schedule/domain/interfaces/ScheduleRepositoryInterface";
import { ScheduleMapper } from "@/modules/schedule/domain/mapper/ScheduleMapper";

export class CreateScheduleUseCase {
  constructor(private readonly scheduleRepo: ScheduleRepositoryInterface) {}

  async execute(
    input: CreateScheduleInput,
  ): Promise<Result<ScheduleSessionItemDTO, Error>> {
    if (input.actor.role === AppRole.STUDENT) {
      return Result.fail(
        new ForbiddenError("Siswa tidak memiliki izin untuk membuat jadwal."),
      );
    }

    if (!input.actor.tenantId) {
      return Result.fail(
        new ValidationError("Tenant ID wajib disertakan untuk membuat jadwal."),
      );
    }

    if (!input.data.title?.trim()) {
      return Result.fail(new ValidationError("Judul sesi jadwal wajib diisi."));
    }

    if (!input.data.startsAt || !input.data.endsAt) {
      return Result.fail(
        new ValidationError("Waktu mulai dan selesai wajib diisi."),
      );
    }

    try {
      const entity = await this.scheduleRepo.createSession({
        tenantId: input.actor.tenantId,
        createdById: input.actor.id,
        data: {
          title: input.data.title.trim(),
          sessionType: input.data.sessionType,
          courseId: input.data.courseId,
          startsAt: input.data.startsAt,
          endsAt: input.data.endsAt,
          room: input.data.room,
          instructor: input.data.instructor,
          classGroup: input.data.classGroup,
          description: input.data.description,
        },
      });

      return Result.ok(ScheduleMapper.toDTO(entity));
    } catch (err: any) {
      return Result.fail(
        new ValidationError(err.message || "Gagal membuat sesi jadwal."),
      );
    }
  }
}

export class UpdateScheduleUseCase {
  constructor(private readonly scheduleRepo: ScheduleRepositoryInterface) {}

  async execute(
    input: UpdateScheduleInput,
  ): Promise<Result<ScheduleSessionItemDTO, Error>> {
    if (input.actor.role === AppRole.STUDENT) {
      return Result.fail(
        new ForbiddenError("Siswa tidak memiliki izin untuk mengubah jadwal."),
      );
    }

    if (!input.actor.tenantId) {
      return Result.fail(
        new ValidationError(
          "Tenant ID wajib disertakan untuk mengubah jadwal.",
        ),
      );
    }

    try {
      const updated = await this.scheduleRepo.updateSession({
        tenantId: input.actor.tenantId,
        sessionId: input.sessionId,
        data: input.data,
      });

      if (!updated) {
        return Result.fail(new NotFoundError("Sesi jadwal tidak ditemukan."));
      }

      return Result.ok(ScheduleMapper.toDTO(updated));
    } catch (err: any) {
      return Result.fail(
        new ValidationError(err.message || "Gagal memperbarui jadwal."),
      );
    }
  }
}

export class PublishScheduleUseCase {
  constructor(private readonly scheduleRepo: ScheduleRepositoryInterface) {}

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

    if (!input.actor.tenantId) {
      return Result.fail(
        new ValidationError(
          "Tenant ID wajib disertakan untuk mempublikasikan jadwal.",
        ),
      );
    }

    try {
      const updated = await this.scheduleRepo.publishSession({
        tenantId: input.actor.tenantId,
        sessionId: input.sessionId,
      });

      if (!updated) {
        return Result.fail(new NotFoundError("Sesi jadwal tidak ditemukan."));
      }

      return Result.ok(ScheduleMapper.toDTO(updated));
    } catch (err: any) {
      return Result.fail(
        new ValidationError(err.message || "Gagal mempublikasikan jadwal."),
      );
    }
  }
}

export class CancelScheduleUseCase {
  constructor(private readonly scheduleRepo: ScheduleRepositoryInterface) {}

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

    if (!input.actor.tenantId) {
      return Result.fail(
        new ValidationError(
          "Tenant ID wajib disertakan untuk membatalkan jadwal.",
        ),
      );
    }

    try {
      const updated = await this.scheduleRepo.cancelSession({
        tenantId: input.actor.tenantId,
        sessionId: input.sessionId,
      });

      if (!updated) {
        return Result.fail(new NotFoundError("Sesi jadwal tidak ditemukan."));
      }

      return Result.ok(ScheduleMapper.toDTO(updated));
    } catch (err: any) {
      return Result.fail(
        new ValidationError(err.message || "Gagal membatalkan jadwal."),
      );
    }
  }
}
