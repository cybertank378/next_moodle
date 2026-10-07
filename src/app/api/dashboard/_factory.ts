import "server-only";

import { DefaultMoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { EncryptedMoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { prisma } from "@/libs/prisma";
import { MoodleCourseRepository } from "@/modules/course/infrastructure/repo/MoodleCourseRepository";
import { GetAdminDashboardUseCase } from "@/modules/dashboard/application/usecases/GetAdminDashboardUseCase";
import { GetProctorDashboardUseCase } from "@/modules/dashboard/application/usecases/GetProctorDashboardUseCase";
import { GetStudentDashboardUseCase } from "@/modules/dashboard/application/usecases/GetStudentDashboardUseCase";
import { GetTeacherDashboardUseCase } from "@/modules/dashboard/application/usecases/GetTeacherDashboardUseCase";
import { GetTenantDashboardUseCase } from "@/modules/dashboard/application/usecases/GetTenantDashboardUseCase";
import { DashboardController } from "@/modules/dashboard/infrastructure/http/DashboardController";
import { PrismaDashboardRepository } from "@/modules/dashboard/infrastructure/repo/PrismaDashboardRepository";
import { MoodleGradeRepository } from "@/modules/grades/infrastructure/repo/MoodleGradeRepository";
import { MoodleQuizRepository } from "@/modules/quiz/infrastructure/repo/MoodleQuizRepository";
import { PrismaMoodleCredentialStore } from "@/modules/tenant/infrastructure/repo/PrismaMoodleCredentialStore";
import { TenantRepository } from "@/modules/tenant/infrastructure/repo/TenantRepository";

let _controller: DashboardController | null = null;
let _clientFactory: DefaultMoodleClientFactory | null = null;

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

export function getDashboardController(): DashboardController {
  if (!_controller) {
    const repo = new PrismaDashboardRepository();
    const clientFactory = getMoodleClientFactory();
    const courseRepo = new MoodleCourseRepository(clientFactory);
    const quizRepo = new MoodleQuizRepository(clientFactory);
    const gradeRepo = new MoodleGradeRepository(clientFactory);
    const tenantRepo = new TenantRepository(prisma);

    _controller = new DashboardController(
      new GetAdminDashboardUseCase(repo),
      new GetStudentDashboardUseCase(
        courseRepo,
        quizRepo,
        gradeRepo,
        clientFactory,
        tenantRepo,
      ),
      new GetTeacherDashboardUseCase(courseRepo, quizRepo, clientFactory),
      new GetTenantDashboardUseCase(),
      new GetProctorDashboardUseCase(),
    );
  }
  return _controller;
}
