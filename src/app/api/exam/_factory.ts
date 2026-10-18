import { DefaultMoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { EncryptedMoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { prisma } from "@/libs/prisma";
import { AddQuestionToQuizUseCase } from "@/modules/exam/application/usecases/AddQuestionToQuizUseCase";
import { AddRandomQuestionsToQuizUseCase } from "@/modules/exam/application/usecases/AddRandomQuestionsToQuizUseCase";
import { GetQuizQuestionsUseCase } from "@/modules/exam/application/usecases/GetQuizQuestionsUseCase";
import { ReorderQuizQuestionsUseCase } from "@/modules/exam/application/usecases/ReorderQuizQuestionsUseCase";
import { ExamAdministrationController } from "@/modules/exam/infrastructure/http/ExamAdministrationController";
import { MoodleExamAdministrationRepository } from "@/modules/exam/infrastructure/repo/MoodleExamAdministrationRepository";
import { PrismaMoodleCredentialStore } from "@/modules/tenant/infrastructure/repo/PrismaMoodleCredentialStore";

let _controller: ExamAdministrationController | null = null;
let _repo: MoodleExamAdministrationRepository | null = null;
let _reorderUseCase: ReorderQuizQuestionsUseCase | null = null;
let _addQuestionUseCase: AddQuestionToQuizUseCase | null = null;
let _addRandomQuestionsUseCase: AddRandomQuestionsToQuizUseCase | null = null;
let _getQuizQuestionsUseCase: GetQuizQuestionsUseCase | null = null;
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

function getExamRepo(): MoodleExamAdministrationRepository {
  if (!_repo) {
    _repo = new MoodleExamAdministrationRepository(getMoodleClientFactory());
  }
  return _repo;
}

export function getReorderQuizQuestionsUseCase(): ReorderQuizQuestionsUseCase {
  if (!_reorderUseCase) {
    _reorderUseCase = new ReorderQuizQuestionsUseCase(getExamRepo());
  }
  return _reorderUseCase;
}

export function getAddQuestionToQuizUseCase(): AddQuestionToQuizUseCase {
  if (!_addQuestionUseCase) {
    _addQuestionUseCase = new AddQuestionToQuizUseCase(getExamRepo());
  }
  return _addQuestionUseCase;
}

export function getAddRandomQuestionsToQuizUseCase(): AddRandomQuestionsToQuizUseCase {
  if (!_addRandomQuestionsUseCase) {
    _addRandomQuestionsUseCase = new AddRandomQuestionsToQuizUseCase(
      getExamRepo(),
    );
  }
  return _addRandomQuestionsUseCase;
}

export function getGetQuizQuestionsUseCase(): GetQuizQuestionsUseCase {
  if (!_getQuizQuestionsUseCase) {
    _getQuizQuestionsUseCase = new GetQuizQuestionsUseCase(getExamRepo());
  }
  return _getQuizQuestionsUseCase;
}

export function getExamAdministrationController(): ExamAdministrationController {
  if (!_controller) {
    _controller = new ExamAdministrationController(
      getReorderQuizQuestionsUseCase(),
      getMoodleClientFactory(),
      getAddQuestionToQuizUseCase(),
      getAddRandomQuestionsToQuizUseCase(),
      getGetQuizQuestionsUseCase(),
    );
  }
  return _controller;
}
