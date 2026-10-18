import { BaseUseCase } from "@/core/base/BaseUseCase";
import { Result } from "@/core/base/Result";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { ValidationError } from "@/core/errors/ValidationError";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { AppRole } from "@/core/rbac/AppRole";
import type { GetStudentScheduleInput } from "@/modules/schedule/domain/dto/ScheduleRequestDTO";
import type { ScheduleResponseDTO } from "@/modules/schedule/domain/dto/ScheduleResponseDTO";
import type { ScheduleRepositoryInterface } from "@/modules/schedule/domain/interfaces/ScheduleRepositoryInterface";
import { ScheduleMapper } from "@/modules/schedule/domain/mapper/ScheduleMapper";

export class GetStudentScheduleUseCase extends BaseUseCase<
  GetStudentScheduleInput,
  Result<ScheduleResponseDTO, Error>
> {
  constructor(
    private readonly repository: ScheduleRepositoryInterface,
    private readonly clientFactory: MoodleClientFactory,
  ) {
    super();
  }

  async handle(
    input: GetStudentScheduleInput,
  ): Promise<Result<ScheduleResponseDTO, Error>> {
    const actor = input.actor;
    if (!actor) {
      return Result.fail(
        new ValidationError("Sesi tidak valid atau telah berakhir."),
      );
    }

    if (actor.role !== AppRole.STUDENT) {
      return Result.fail(
        new ForbiddenError(
          "Jadwal pelajaran siswa hanya dapat diakses oleh siswa.",
        ),
      );
    }

    const tenantId = actor.tenantId;
    if (!tenantId) {
      return Result.fail(
        new ValidationError(
          "Tenant ID wajib ditentukan untuk mengambil jadwal pelajaran.",
        ),
      );
    }

    const moodleUserId = actor.moodleUserId;
    if (!moodleUserId) {
      return Result.fail(
        new ValidationError("Moodle User ID tidak ditemukan untuk sesi siswa."),
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
      const fromDate = new Date(input.query.from);
      const toDate = new Date(input.query.to);

      const client = await this.clientFactory.createClientForUser(
        {
          tenantId,
          tenantSlug: tenantId,
          status: "ACTIVE",
        },
        input.moodleToken,
      );

      const sessions = await this.repository.getStudentSchedule({
        tenantId,
        moodleUserId,
        from: fromDate,
        to: toDate,
        types: input.query.types,
        courseId: input.query.courseId,
        client,
      });

      // Deduplicate by ID
      const seenIds = new Set<string>();
      const dedupedSessions = sessions.filter((s) => {
        if (seenIds.has(s.id)) return false;
        seenIds.add(s.id);
        return true;
      });

      // Sort chronological by startsAt ascending
      dedupedSessions.sort((a, b) => {
        return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
      });

      const items = dedupedSessions.map(ScheduleMapper.toDTO);

      return Result.ok({
        items,
        range: {
          from: input.query.from,
          to: input.query.to,
        },
        meta: {
          total: items.length,
          supportedTypes: ["EXAM"],
          blockedTypes: ["LESSON", "CONSULTATION", "OTHER"],
        },
      });
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
