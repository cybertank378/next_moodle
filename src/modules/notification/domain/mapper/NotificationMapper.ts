import type { NotificationResponseDto } from "../dto/NotificationResponseDto";
import type { NotificationEntity } from "../entity/NotificationEntity";

export class NotificationMapper {
  static toDto(entity: NotificationEntity): NotificationResponseDto {
    const json = entity.toJSON();
    return {
      id: json.id,
      type: json.type,
      title: json.title,
      body: json.body,
      linkPath: json.linkPath,
      isRead: json.isRead,
      readAt: json.readAt ? json.readAt.toISOString() : null,
      createdAt: json.createdAt.toISOString(),
    };
  }
}
