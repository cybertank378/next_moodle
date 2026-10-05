import { DefaultMoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { EncryptedMoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { prisma } from "@/libs/prisma";
import { PrismaMoodleCredentialStore } from "@/modules/tenant/infrastructure/repo/PrismaMoodleCredentialStore";

import { MoodleExamMonitorRepository } from "@/modules/exam-monitor/infrastructure/repo/MoodleExamMonitorRepository";
import { ExamMonitorController } from "@/modules/exam-monitor/infrastructure/http/ExamMonitorController";
import { GetExamMonitorUseCase } from "@/modules/exam-monitor/application/usecases/GetExamMonitorUseCase";
import { LockAttemptUseCase } from "@/modules/exam-monitor/application/usecases/LockAttemptUseCase";
import { UnlockAttemptUseCase } from "@/modules/exam-monitor/application/usecases/UnlockAttemptUseCase";
import { ForceFinishAttemptUseCase } from "@/modules/exam-monitor/application/usecases/ForceFinishAttemptUseCase";
import { ExtendTimeUseCase } from "@/modules/exam-monitor/application/usecases/ExtendTimeUseCase";

let _controller: ExamMonitorController;
let _clientFactory: DefaultMoodleClientFactory;

function getMoodleClientFactory() {
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

export function getExamMonitorController() {
  if (!_controller) {
    const repo = new MoodleExamMonitorRepository(getMoodleClientFactory());

    const getMonitorUc = new GetExamMonitorUseCase(repo);
    const lockUc = new LockAttemptUseCase(repo);
    const unlockUc = new UnlockAttemptUseCase(repo);
    const forceFinishUc = new ForceFinishAttemptUseCase(repo);
    const extendUc = new ExtendTimeUseCase(repo);

    _controller = new ExamMonitorController(
      getMonitorUc,
      lockUc,
      unlockUc,
      forceFinishUc,
      extendUc,
    );
  }
  return _controller;
}
