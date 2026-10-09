import "server-only";

import { DefaultMoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { EncryptedMoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { prisma } from "@/libs/prisma";
import { GetAttemptDataUseCase } from "@/modules/quiz/application/usecases/GetAttemptDataUseCase";
import { GetAttemptSummaryUseCase } from "@/modules/quiz/application/usecases/GetAttemptSummaryUseCase";
import { GetUserAttemptsUseCase } from "@/modules/quiz/application/usecases/GetUserAttemptsUseCase";
import { SaveQuizAnswerUseCase } from "@/modules/quiz/application/usecases/SaveQuizAnswerUseCase";
import { StartQuizAttemptUseCase } from "@/modules/quiz/application/usecases/StartQuizAttemptUseCase";
import { SubmitQuizAttemptUseCase } from "@/modules/quiz/application/usecases/SubmitQuizAttemptUseCase";
import { QuizAttemptController } from "@/modules/quiz/infrastructure/http/QuizAttemptController";
import { MoodleQuizAttemptRepository } from "@/modules/quiz/infrastructure/repo/MoodleQuizAttemptRepository";
import { PrismaMoodleCredentialStore } from "@/modules/tenant/infrastructure/repo/PrismaMoodleCredentialStore";

let controller: QuizAttemptController | null = null;

export function getQuizAttemptController(): QuizAttemptController {
  if (controller) return controller;

  const credentialStore = new PrismaMoodleCredentialStore(prisma);
  const encryption = new AesHkdfEncryptionProvider();
  const credentialProvider = new EncryptedMoodleCredentialProvider(
    credentialStore,
    encryption,
  );
  const clientFactory = new DefaultMoodleClientFactory(credentialProvider);
  const repository = new MoodleQuizAttemptRepository(clientFactory);

  controller = new QuizAttemptController(
    new StartQuizAttemptUseCase(repository),
    new SaveQuizAnswerUseCase(repository),
    new SubmitQuizAttemptUseCase(repository),
    new GetUserAttemptsUseCase(repository),
    new GetAttemptDataUseCase(repository),
    new GetAttemptSummaryUseCase(repository),
  );

  return controller;
}
