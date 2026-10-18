import { BaseService } from "@/core/base/BaseService";
import type { Result } from "@/core/base/Result";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import {
  GetStudentCalendarEventsUseCase,
  type GetStudentCalendarEventsInput,
} from "@/modules/calendar/application/usecases/GetStudentCalendarEventsUseCase";
import type { CalendarEventsResponseDTO } from "@/modules/calendar/domain/dto/CalendarResponseDTO";
import type { CalendarRepositoryInterface } from "@/modules/calendar/domain/interfaces/CalendarRepositoryInterface";

/* ============================================================
 * CALENDAR SERVICE
 * ============================================================
 *
 * Responsibility:
 * - Application Facade
 * - UseCase Orchestrator
 * - Transaction Boundary
 * - Calendar Workflow Coordinator
 * - Thin Application Entry Point
 *
 * NOT:
 * - Business Logic Layer
 * - Repository Wrapper
 * - Database Layer
 * ============================================================
 */

export class CalendarService extends BaseService {
  private readonly getStudentCalendarEventsUseCase: GetStudentCalendarEventsUseCase;

  constructor(
    repository: CalendarRepositoryInterface,
    clientFactory: MoodleClientFactory,
  ) {
    super();

    this.getStudentCalendarEventsUseCase = new GetStudentCalendarEventsUseCase(
      repository,
      clientFactory,
    );
  }

  getStudentCalendarEvents(
    input: GetStudentCalendarEventsInput,
  ): Promise<Result<CalendarEventsResponseDTO, Error>> {
    return this.execute(() =>
      this.getStudentCalendarEventsUseCase.execute(input),
    );
  }
}
