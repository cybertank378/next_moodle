import "server-only";

import { DefaultMoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { EncryptedMoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { prisma } from "@/libs/prisma";
import { EnrolUsersUseCase } from "@/modules/enrolment/application/usecases/EnrolUsersUseCase";
import { ListEnrolmentsUseCase } from "@/modules/enrolment/application/usecases/ListEnrolmentsUseCase";
import { UnenrolUsersUseCase } from "@/modules/enrolment/application/usecases/UnenrolUsersUseCase";
import { EnrolmentController } from "@/modules/enrolment/infrastructure/http/EnrolmentController";
import { MoodleEnrolmentRepository } from "@/modules/enrolment/infrastructure/repo/MoodleEnrolmentRepository";
import { PrismaMoodleCredentialStore } from "@/modules/tenant/infrastructure/repo/PrismaMoodleCredentialStore";

let controller: EnrolmentController | null = null;

export function getEnrolmentController(): EnrolmentController {
  if (controller) return controller;

  const credentialStore = new PrismaMoodleCredentialStore(prisma);
  const encryption = new AesHkdfEncryptionProvider();
  const credentialProvider = new EncryptedMoodleCredentialProvider(
    credentialStore,
    encryption,
  );
  const clientFactory = new DefaultMoodleClientFactory(credentialProvider);
  const repository = new MoodleEnrolmentRepository(clientFactory);

  controller = new EnrolmentController(
    new ListEnrolmentsUseCase(repository),
    new EnrolUsersUseCase(repository),
    new UnenrolUsersUseCase(repository),
  );

  return controller;
}
