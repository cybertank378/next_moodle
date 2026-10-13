import type { ScheduleSessionItemDTO } from "@/modules/schedule/domain/dto/ScheduleResponseDTO";
import type { ScheduleSessionEntity } from "@/modules/schedule/domain/entity/ScheduleSessionEntity";

// biome-ignore lint/complexity/noStaticOnlyClass: DDD mapper convention
export class ScheduleMapper {
  static toDTO(entity: ScheduleSessionEntity): ScheduleSessionItemDTO {
    return {
      id: entity.id,
      sessionType: entity.sessionType,
      title: entity.title,
      startsAt: entity.startsAt,
      endsAt: entity.endsAt,
      allDay: entity.allDay,
      courseId: entity.courseId,
      courseName: entity.courseName,
      subjectCode: entity.subjectCode,
      room: entity.room,
      instructor: entity.instructor,
      classGroup: entity.classGroup,
      status: entity.status,
      detailRoute: entity.detailRoute,
      timezone: entity.timezone,
      description: entity.description,
      sourceUpdatedAt: entity.sourceUpdatedAt,
    };
  }
}
