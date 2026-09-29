import "server-only";

import { DefaultMoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { EncryptedMoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { prisma } from "@/libs/prisma";
import { GetCourseGradesUseCase } from "@/modules/grades/application/usecases/GetCourseGradesUseCase";
import { GetUserGradesUseCase } from "@/modules/grades/application/usecases/GetUserGradesUseCase";
import { GradeController } from "@/modules/grades/infrastructure/http/GradeController";
import { MoodleGradeRepository } from "@/modules/grades/infrastructure/repo/MoodleGradeRepository";
import { PrismaMoodleCredentialStore } from "@/modules/tenant/infrastructure/repo/PrismaMoodleCredentialStore";

let controller: GradeController | null = null;

export function getGradeController(): GradeController {
  if (controller) return controller;

  const credentialStore = new PrismaMoodleCredentialStore(prisma);
  const encryption = new AesHkdfEncryptionProvider();
  const credentialProvider = new EncryptedMoodleCredentialProvider(
    credentialStore,
    encryption,
  );
  const clientFactory = new DefaultMoodleClientFactory(credentialProvider);
  const repository = new MoodleGradeRepository(clientFactory);

  controller = new GradeController(
    new GetUserGradesUseCase(repository),
    new GetCourseGradesUseCase(repository),
  );

  return controller;
}
