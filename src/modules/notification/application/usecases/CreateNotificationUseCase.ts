import { ValidationError } from "@/core/errors/ValidationError";
import type { CreateNotificationRequestDto } from "../../domain/dto/NotificationRequestDto";
import type { NotificationEntity } from "../../domain/entity/NotificationEntity";
import type { NotificationRepositoryInterface } from "../../domain/interfaces/NotificationRepositoryInterface";

const MAX_TITLE_LENGTH = 200;
const MAX_BODY_LENGTH = 1000;

/** Only same-origin absolute app paths: `/x`, but not `//host` or `/\host`. */
function isInternalPath(path: string): boolean {
  return /^\/(?![/\\])[^\s]*$/.test(path);
}

/**
 * Entry point for server-side producers (domain events such as import
 * completion or exam result availability). Not exposed to the browser.
 */
export class CreateNotificationUseCase {
  constructor(private readonly repo: NotificationRepositoryInterface) {}

  async execute(dto: CreateNotificationRequestDto): Promise<NotificationEntity> {
    const title = dto.title.trim();
    const body = dto.body.trim();
    const linkPath = dto.linkPath?.trim() || null;

    if (!title || title.length > MAX_TITLE_LENGTH) {
      throw new ValidationError(
        `Judul notifikasi wajib diisi (maks. ${MAX_TITLE_LENGTH} karakter).`,
      );
    }
    if (body.length > MAX_BODY_LENGTH) {
      throw new ValidationError(
        `Isi notifikasi maksimal ${MAX_BODY_LENGTH} karakter.`,
      );
    }
    if (linkPath !== null && !isInternalPath(linkPath)) {
      throw new ValidationError("Tautan notifikasi harus berupa path internal aplikasi.");
    }

    return this.repo.create({
      scope: dto.scope,
      type: dto.type,
      title,
      body,
      linkPath,
    });
  }
}
