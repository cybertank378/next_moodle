import "server-only";

import { DefaultMoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { EncryptedMoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { prisma } from "@/libs/prisma";
import { PrismaMoodleCredentialStore } from "@/modules/tenant/infrastructure/repo/PrismaMoodleCredentialStore";
import { CreateUsersUseCase } from "@/modules/user/application/usecases/CreateUsersUseCase";
import { ImportUsersUseCase } from "@/modules/user/application/usecases/ImportUsersUseCase";
import { ListUsersUseCase } from "@/modules/user/application/usecases/ListUsersUseCase";
import { UserController } from "@/modules/user/infrastructure/http/UserController";
import { MoodleUserRepository } from "@/modules/user/infrastructure/repo/MoodleUserRepository";

let controller: UserController | null = null;

export function getUserController(): UserController {
  if (controller) return controller;

  const credentialStore = new PrismaMoodleCredentialStore(prisma);
  const encryption = new AesHkdfEncryptionProvider();
  const credentialProvider = new EncryptedMoodleCredentialProvider(
    credentialStore,
    encryption,
  );
  const clientFactory = new DefaultMoodleClientFactory(credentialProvider);
  const repository = new MoodleUserRepository(clientFactory);

  controller = new UserController(
    new ListUsersUseCase(repository),
    new CreateUsersUseCase(repository),
    new ImportUsersUseCase(repository),
  );

  return controller;
}
