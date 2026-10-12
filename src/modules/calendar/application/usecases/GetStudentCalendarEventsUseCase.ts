import { Result } from "@/core/base/Result";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { ValidationError } from "@/core/errors/ValidationError";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { AppRole } from "@/core/rbac/AppRole";
import type { GetStudentCalendarEventsInput } from "@/modules/calendar/domain/dto/CalendarRequestDTO";
import type { CalendarEventsResponseDTO } from "@/modules/calendar/domain/dto/CalendarResponseDTO";
import type { CalendarRepositoryInterface } from "@/modules/calendar/domain/interfaces/CalendarRepositoryInterface";
import { CalendarEventMapper } from "@/modules/calendar/domain/mapper/CalendarEventMapper";

export class GetStudentCalendarEventsUseCase {
  constructor(
    private readonly repository: CalendarRepositoryInterface,
    private readonly clientFactory: MoodleClientFactory,
  ) {}

  async execute(
    input: GetStudentCalendarEventsInput,
  ): Promise<Result<CalendarEventsResponseDTO, Error>> {
    const actor = input.actor;
    if (!actor) {
      return Result.fail(
        new ValidationError("Sesi tidak valid atau telah berakhir."),
      );
    }

    if (actor.role !== AppRole.STUDENT) {
      return Result.fail(
        new ForbiddenError(
          "Kalender akademik siswa hanya dapat diakses oleh siswa.",
        ),
      );
    }

    const tenantId = actor.tenantId;
    if (!tenantId) {
      return Result.fail(
        new ValidationError(
          "Tenant ID wajib ditentukan untuk mengambil kalender.",
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

      const events = await this.repository.getStudentCalendarEvents({
        tenantId,
        moodleUserId,
        from: fromDate,
        to: toDate,
        types: input.query.types,
        client,
      });

      // Deduplicate by ID
      const seenIds = new Set<string>();
      const dedupedEvents = events.filter((e) => {
        if (seenIds.has(e.id)) return false;
        seenIds.add(e.id);
        return true;
      });

      // Sort chronological by startAt ascending
      dedupedEvents.sort((a, b) => {
        return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
      });

      const items = dedupedEvents.map(CalendarEventMapper.toDTO);

      return Result.ok({
        items,
        range: {
          from: input.query.from,
          to: input.query.to,
        },
        meta: {
          total: items.length,
          supportedTypes: ["QUIZ_EXAM"],
          blockedTypes: ["COURSE_CLASS", "ASSIGNMENT_DUE", "ACADEMIC_EVENT"],
        },
      });
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
