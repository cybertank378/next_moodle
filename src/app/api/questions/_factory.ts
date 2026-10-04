import { CreateQuestionUseCase } from "@/modules/questions/application/usecases/CreateQuestionUseCase";
import { UpdateQuestionUseCase } from "@/modules/questions/application/usecases/UpdateQuestionUseCase";
import { MoodleQuestionRepository } from "@/modules/questions/infrastructure/repo/MoodleQuestionRepository";
import { QuestionController } from "@/modules/questions/infrastructure/http/QuestionController";
import { DefaultMoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { EncryptedMoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { PrismaMoodleCredentialStore } from "@/modules/tenant/infrastructure/repo/PrismaMoodleCredentialStore";
import { prisma } from "@/libs/prisma";

let _controller: QuestionController | null = null;
let _createQuestionUseCase: CreateQuestionUseCase | null = null;
let _updateQuestionUseCase: UpdateQuestionUseCase | null = null;
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

export function getCreateQuestionUseCase(): CreateQuestionUseCase {
  if (!_createQuestionUseCase) {
    const repo = new MoodleQuestionRepository();
    _createQuestionUseCase = new CreateQuestionUseCase(repo);
  }
  return _createQuestionUseCase;
}

export function getUpdateQuestionUseCase(): UpdateQuestionUseCase {
  if (!_updateQuestionUseCase) {
    const repo = new MoodleQuestionRepository();
    _updateQuestionUseCase = new UpdateQuestionUseCase(repo);
  }
  return _updateQuestionUseCase;
}

export function getQuestionController(): QuestionController {
  if (!_controller) {
    _controller = new QuestionController(
      getCreateQuestionUseCase(),
      getUpdateQuestionUseCase(),
      getMoodleClientFactory()
    );
  }
  return _controller;
}
