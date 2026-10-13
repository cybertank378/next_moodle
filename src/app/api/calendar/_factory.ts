import "server-only";

import { DefaultMoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { EncryptedMoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { prisma } from "@/libs/prisma";
import { GetStudentCalendarEventsUseCase } from "@/modules/calendar/application/usecases/GetStudentCalendarEventsUseCase";
import { CalendarController } from "@/modules/calendar/infrastructure/http/CalendarController";
import { MoodleCalendarRepository } from "@/modules/calendar/infrastructure/repo/MoodleCalendarRepository";
import { MoodleCourseRepository } from "@/modules/course/infrastructure/repo/MoodleCourseRepository";
import { MoodleQuizRepository } from "@/modules/quiz/infrastructure/repo/MoodleQuizRepository";
import { PrismaMoodleCredentialStore } from "@/modules/tenant/infrastructure/repo/PrismaMoodleCredentialStore";

let controller: CalendarController | null = null;

export function getCalendarController(): CalendarController {
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
  const calendarRepo = new MoodleCalendarRepository(courseRepo, quizRepo);

  const useCase = new GetStudentCalendarEventsUseCase(
    calendarRepo,
    clientFactory,
  );

  controller = new CalendarController(useCase);
  return controller;
}
