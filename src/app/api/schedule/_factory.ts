import "server-only";

import { DefaultMoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { EncryptedMoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { prisma } from "@/libs/prisma";
import { MoodleCourseRepository } from "@/modules/course/infrastructure/repo/MoodleCourseRepository";
import { MoodleQuizRepository } from "@/modules/quiz/infrastructure/repo/MoodleQuizRepository";
import { GetScheduleSessionDetailUseCase } from "@/modules/schedule/application/usecases/GetScheduleSessionDetailUseCase";
import { GetStudentScheduleUseCase } from "@/modules/schedule/application/usecases/GetStudentScheduleUseCase";
import { GetTeacherSchedulesUseCase } from "@/modules/schedule/application/usecases/GetTeacherSchedulesUseCase";
import { GetTenantSchedulesUseCase } from "@/modules/schedule/application/usecases/GetTenantSchedulesUseCase";
import {
  CancelScheduleUseCase,
  CreateScheduleUseCase,
  PublishScheduleUseCase,
  UpdateScheduleUseCase,
} from "@/modules/schedule/application/usecases/MutateScheduleUseCases";
import { ScheduleController } from "@/modules/schedule/infrastructure/http/ScheduleController";
import { MoodleScheduleRepository } from "@/modules/schedule/infrastructure/repo/MoodleScheduleRepository";
import { PrismaMoodleCredentialStore } from "@/modules/tenant/infrastructure/repo/PrismaMoodleCredentialStore";

let controller: ScheduleController | null = null;

export function getScheduleController(): ScheduleController {
  if (controller) return controller;

  const credentialStore = new PrismaMoodleCredentialStore(prisma);
  const encryption = new AesHkdfEncryptionProvider();
  const credentialProvider = new EncryptedMoodleCredentialProvider(
    credentialStore,
    encryption,
  );
  const clientFactory = new DefaultMoodleClientFactory(credentialProvider);

  const courseRepo = new MoodleCourseRepository(clientFactory);
  const quizRepo = new MoodleQuizRepository(clientFactory);
  const scheduleRepo = new MoodleScheduleRepository(courseRepo, quizRepo);

  const getStudentScheduleUseCase = new GetStudentScheduleUseCase(
    scheduleRepo,
    clientFactory,
  );
  const getTenantSchedulesUseCase = new GetTenantSchedulesUseCase(
    scheduleRepo,
    clientFactory,
  );
  const getTeacherSchedulesUseCase = new GetTeacherSchedulesUseCase(
    scheduleRepo,
    clientFactory,
  );
  const getScheduleSessionDetailUseCase = new GetScheduleSessionDetailUseCase(
    scheduleRepo,
    clientFactory,
  );

  const createScheduleUseCase = new CreateScheduleUseCase(scheduleRepo);
  const updateScheduleUseCase = new UpdateScheduleUseCase(scheduleRepo);
  const publishScheduleUseCase = new PublishScheduleUseCase(scheduleRepo);
  const cancelScheduleUseCase = new CancelScheduleUseCase(scheduleRepo);

  controller = new ScheduleController(
    getStudentScheduleUseCase,
    getTenantSchedulesUseCase,
    getTeacherSchedulesUseCase,
    getScheduleSessionDetailUseCase,
    createScheduleUseCase,
    updateScheduleUseCase,
    publishScheduleUseCase,
    cancelScheduleUseCase,
  );
  return controller;
}
