import type { CalendarEventItemDTO } from "@/modules/calendar/domain/dto/CalendarResponseDTO";
import type { CalendarEventEntity } from "@/modules/calendar/domain/entity/CalendarEventEntity";

export class CalendarEventMapper {
  static toDTO(entity: CalendarEventEntity): CalendarEventItemDTO {
    return {
      id: entity.id,
      sourceType: entity.sourceType,
      title: entity.title,
      startAt: entity.startAt,
      endAt: entity.endAt ?? null,
      allDay: entity.allDay,
      courseId: entity.courseId,
      courseName: entity.courseName,
      relatedResourceId: entity.relatedResourceId,
      description: entity.description,
      status: entity.status,
      detailRoute: entity.detailRoute,
      timezone: entity.timezone,
    };
  }
}
