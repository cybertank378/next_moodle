import "server-only";

import { DefaultMoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { EncryptedMoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { prisma } from "@/libs/prisma";
import {
  GetAssignmentDetailUseCase,
  GetStudentAssignmentsUseCase,
  SubmitAssignmentUseCase,
} from "@/modules/assignment/application/usecases/AssignmentUseCases";
import { AssignmentController } from "@/modules/assignment/infrastructure/http/AssignmentController";
import { MoodleAssignmentRepository } from "@/modules/assignment/infrastructure/repo/MoodleAssignmentRepository";
import { MoodleCourseRepository } from "@/modules/course/infrastructure/repo/MoodleCourseRepository";
import { PrismaMoodleCredentialStore } from "@/modules/tenant/infrastructure/repo/PrismaMoodleCredentialStore";

let controller: AssignmentController | null = null;

export function getAssignmentController(): AssignmentController {
  if (controller) return controller;

  const credentialStore = new PrismaMoodleCredentialStore(prisma);
  const encryption = new AesHkdfEncryptionProvider();
  const credentialProvider = new EncryptedMoodleCredentialProvider(
    credentialStore,
    encryption,
  );
  const clientFactory = new DefaultMoodleClientFactory(credentialProvider);

  const courseRepo = new MoodleCourseRepository(clientFactory);
  const assignmentRepo = new MoodleAssignmentRepository(courseRepo);

  const getStudentAssignmentsUseCase = new GetStudentAssignmentsUseCase(
    assignmentRepo,
    clientFactory,
  );
  const getAssignmentDetailUseCase = new GetAssignmentDetailUseCase(
    assignmentRepo,
    clientFactory,
  );
  const submitAssignmentUseCase = new SubmitAssignmentUseCase();

  controller = new AssignmentController(
    getStudentAssignmentsUseCase,
    getAssignmentDetailUseCase,
    submitAssignmentUseCase,
  );

  return controller;
}
