import { DefaultMoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { EncryptedMoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { prisma } from "@/libs/prisma";
import { ReorderQuizQuestionsUseCase } from "@/modules/exam-administration/application/usecases/ReorderQuizQuestionsUseCase";
import { ExamAdministrationController } from "@/modules/exam-administration/infrastructure/http/ExamAdministrationController";
import { MoodleExamAdministrationRepository } from "@/modules/exam-administration/infrastructure/repo/MoodleExamAdministrationRepository";
import { PrismaMoodleCredentialStore } from "@/modules/tenant/infrastructure/repo/PrismaMoodleCredentialStore";

let _controller: ExamAdministrationController | null = null;
let _reorderUseCase: ReorderQuizQuestionsUseCase | null = null;
let _clientFactory: DefaultMoodleClientFactory | null = null;

export function getMoodleClientFactory() {
  if (!_clientFactory) {
    const credentialStore = new PrismaMoodleCredentialStore(prisma);
    const encryption = new AesHkdfEncryptionProvider();
    const credentialProvider = new EncryptedMoodleCredentialProvider(
      credentialStore,
      encryption,
    );
    _clientFactory = new DefaultMoodleClientFactory(credentialProvider);
  }
  return _clientFactory;
}

export function getReorderQuizQuestionsUseCase(): ReorderQuizQuestionsUseCase {
  if (!_reorderUseCase) {
    const repo = new MoodleExamAdministrationRepository();
    _reorderUseCase = new ReorderQuizQuestionsUseCase(repo);
  }
  return _reorderUseCase;
}

export function getExamAdministrationController(): ExamAdministrationController {
  if (!_controller) {
    _controller = new ExamAdministrationController(
      getReorderQuizQuestionsUseCase(),
      getMoodleClientFactory(),
    );
  }
  return _controller;
}
