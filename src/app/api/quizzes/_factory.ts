import "server-only";

import { DefaultMoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { EncryptedMoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { prisma } from "@/libs/prisma";
import { CheckQuizAccessUseCase } from "@/modules/quiz/application/usecases/CheckQuizAccessUseCase";
import { GetQuizDetailUseCase } from "@/modules/quiz/application/usecases/GetQuizDetailUseCase";
import { GetQuizzesByCourseUseCase } from "@/modules/quiz/application/usecases/GetQuizzesByCourseUseCase";
import { QuizController } from "@/modules/quiz/infrastructure/http/QuizController";
import { MoodleQuizRepository } from "@/modules/quiz/infrastructure/repo/MoodleQuizRepository";
import { PrismaMoodleCredentialStore } from "@/modules/tenant/infrastructure/repo/PrismaMoodleCredentialStore";

let controller: QuizController | null = null;

export function getQuizController(): QuizController {
  if (controller) return controller;

  const credentialStore = new PrismaMoodleCredentialStore(prisma);
  const encryption = new AesHkdfEncryptionProvider();
  const credentialProvider = new EncryptedMoodleCredentialProvider(
    credentialStore,
    encryption,
  );
  const clientFactory = new DefaultMoodleClientFactory(credentialProvider);
  const repository = new MoodleQuizRepository(clientFactory);

  controller = new QuizController(
    new GetQuizzesByCourseUseCase(repository),
    new GetQuizDetailUseCase(repository),
    new CheckQuizAccessUseCase(repository),
  );

  return controller;
}
