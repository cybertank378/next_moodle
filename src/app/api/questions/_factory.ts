import { DefaultMoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { EncryptedMoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { prisma } from "@/libs/prisma";
import { CreateQuestionCategoryUseCase } from "@/modules/questions/application/usecases/CreateQuestionCategoryUseCase";
import { CreateQuestionUseCase } from "@/modules/questions/application/usecases/CreateQuestionUseCase";
import { GetQuestionCategoriesUseCase } from "@/modules/questions/application/usecases/GetQuestionCategoriesUseCase";
import { GetQuestionsUseCase } from "@/modules/questions/application/usecases/GetQuestionsUseCase";
import { UpdateQuestionUseCase } from "@/modules/questions/application/usecases/UpdateQuestionUseCase";
import { QuestionController } from "@/modules/questions/infrastructure/http/QuestionController";
import { MoodleQuestionRepository } from "@/modules/questions/infrastructure/repo/MoodleQuestionRepository";
import { PrismaMoodleCredentialStore } from "@/modules/tenant/infrastructure/repo/PrismaMoodleCredentialStore";

let _controller: QuestionController | null = null;
let _repo: MoodleQuestionRepository | null = null;
let _createQuestionUseCase: CreateQuestionUseCase | null = null;
let _updateQuestionUseCase: UpdateQuestionUseCase | null = null;
let _getQuestionsUseCase: GetQuestionsUseCase | null = null;
let _getCategoriesUseCase: GetQuestionCategoriesUseCase | null = null;
let _createCategoryUseCase: CreateQuestionCategoryUseCase | null = null;
let _clientFactory: DefaultMoodleClientFactory | null = null;

function getRepo(): MoodleQuestionRepository {
  if (!_repo) {
    _repo = new MoodleQuestionRepository();
  }
  return _repo;
}

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
    _createQuestionUseCase = new CreateQuestionUseCase(getRepo());
  }
  return _createQuestionUseCase;
}

export function getUpdateQuestionUseCase(): UpdateQuestionUseCase {
  if (!_updateQuestionUseCase) {
    _updateQuestionUseCase = new UpdateQuestionUseCase(getRepo());
  }
  return _updateQuestionUseCase;
}

export function getGetQuestionsUseCase(): GetQuestionsUseCase {
  if (!_getQuestionsUseCase) {
    _getQuestionsUseCase = new GetQuestionsUseCase(getRepo());
  }
  return _getQuestionsUseCase;
}

export function getGetQuestionCategoriesUseCase(): GetQuestionCategoriesUseCase {
  if (!_getCategoriesUseCase) {
    _getCategoriesUseCase = new GetQuestionCategoriesUseCase(getRepo());
  }
  return _getCategoriesUseCase;
}

export function getCreateQuestionCategoryUseCase(): CreateQuestionCategoryUseCase {
  if (!_createCategoryUseCase) {
    _createCategoryUseCase = new CreateQuestionCategoryUseCase(getRepo());
  }
  return _createCategoryUseCase;
}

export function getQuestionController(): QuestionController {
  if (!_controller) {
    _controller = new QuestionController(
      getCreateQuestionUseCase(),
      getUpdateQuestionUseCase(),
      getMoodleClientFactory(),
      getGetQuestionsUseCase(),
      getGetQuestionCategoriesUseCase(),
      getCreateQuestionCategoryUseCase(),
    );
  }
  return _controller;
}
