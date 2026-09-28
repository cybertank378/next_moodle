import "server-only";

import { DefaultMoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { EncryptedMoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { prisma } from "@/libs/prisma";
import { GetCourseContentsUseCase } from "@/modules/course/application/usecases/GetCourseContentsUseCase";
import { GetUserCoursesUseCase } from "@/modules/course/application/usecases/GetUserCoursesUseCase";
import { CourseController } from "@/modules/course/infrastructure/http/CourseController";
import { MoodleCourseRepository } from "@/modules/course/infrastructure/repo/MoodleCourseRepository";
import { PrismaMoodleCredentialStore } from "@/modules/tenant/infrastructure/repo/PrismaMoodleCredentialStore";

let controller: CourseController | null = null;

export function getCourseController(): CourseController {
  if (controller) return controller;

  const credentialStore = new PrismaMoodleCredentialStore(prisma);
  const encryption = new AesHkdfEncryptionProvider();
  const credentialProvider = new EncryptedMoodleCredentialProvider(
    credentialStore,
    encryption,
  );
  const clientFactory = new DefaultMoodleClientFactory(credentialProvider);
  const repository = new MoodleCourseRepository(clientFactory);

  controller = new CourseController(
    new GetUserCoursesUseCase(repository),
    new GetCourseContentsUseCase(repository),
  );

  return controller;
}
