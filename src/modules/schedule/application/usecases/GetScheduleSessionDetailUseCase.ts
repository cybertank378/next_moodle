import { Result } from "@/core/base/Result";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { ValidationError } from "@/core/errors/ValidationError";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { AppRole } from "@/core/rbac/AppRole";
import type { GetScheduleSessionDetailInput } from "@/modules/schedule/domain/dto/ScheduleRequestDTO";
import type { ScheduleSessionItemDTO } from "@/modules/schedule/domain/dto/ScheduleResponseDTO";
import type { ScheduleRepositoryInterface } from "@/modules/schedule/domain/interfaces/ScheduleRepositoryInterface";
import { ScheduleMapper } from "@/modules/schedule/domain/mapper/ScheduleMapper";

export class GetScheduleSessionDetailUseCase {
  constructor(
    private readonly repository: ScheduleRepositoryInterface,
    private readonly clientFactory: MoodleClientFactory,
  ) {}

  async execute(
    input: GetScheduleSessionDetailInput,
  ): Promise<Result<ScheduleSessionItemDTO, Error>> {
    const actor = input.actor;
    if (!actor) {
      return Result.fail(
        new ValidationError("Sesi tidak valid atau telah berakhir."),
      );
    }

    if (actor.role !== AppRole.STUDENT) {
      return Result.fail(
        new ForbiddenError(
          "Detail sesi jadwal hanya dapat diakses oleh siswa.",
        ),
      );
    }

    const tenantId = actor.tenantId;
    if (!tenantId) {
      return Result.fail(
        new ValidationError(
          "Tenant ID wajib ditentukan untuk mengambil detail sesi.",
        ),
      );
    }

    const moodleUserId = actor.moodleUserId;
    if (!moodleUserId) {
      return Result.fail(
        new ValidationError("Moodle User ID tidak ditemukan untuk sesi siswa."),
      );
    }

    if (!input.sessionId) {
      return Result.fail(
        new ValidationError("Session ID wajib ditentukan."),
      );
    }

    if (!input.moodleToken) {
      return Result.fail(
        new ValidationError(
          "Kredensial atau token Moodle siswa wajib disertakan.",
        ),
      );
    }

    try {
      const client = await this.clientFactory.createClientForUser(
        {
          tenantId,
          tenantSlug: tenantId,
          status: "ACTIVE",
        },
        input.moodleToken,
      );

      const session = await this.repository.getSessionById({
        tenantId,
        moodleUserId,
        sessionId: input.sessionId,
        client,
      });

      if (!session) {
        return Result.fail(
          new NotFoundError("Sesi jadwal tidak ditemukan atau tidak dapat diakses."),
        );
      }

      return Result.ok(ScheduleMapper.toDTO(session));
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
