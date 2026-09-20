import { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { ChangeTenantStatusUseCase } from "@/modules/tenant/application/usecases/ChangeTenantStatusUseCase";
import { CreateTenantUseCase } from "@/modules/tenant/application/usecases/CreateTenantUseCase";
import { GetTenantBySlugUseCase } from "@/modules/tenant/application/usecases/GetTenantBySlugUseCase";
import { GetTenantUseCase } from "@/modules/tenant/application/usecases/GetTenantUseCase";
import { TestTenantMoodleConnectionUseCase } from "@/modules/tenant/application/usecases/TestTenantMoodleConnectionUseCase";
import { UpdateTenantUseCase } from "@/modules/tenant/application/usecases/UpdateTenantUseCase";
import { defaultEncryptionProvider } from "@/modules/tenant/infrastructure/providers/AesGcmEncryptionProvider";
import { EncryptedTenantCredentialProvider } from "@/modules/tenant/infrastructure/providers/EncryptedTenantCredentialProvider";
import { MoodleTenantConnectionTester } from "@/modules/tenant/infrastructure/providers/MoodleTenantConnectionTester";
import { DatabaseTenantCredentialRepository } from "@/modules/tenant/infrastructure/repositories/DatabaseTenantCredentialRepository";
import { DatabaseTenantRepository } from "@/modules/tenant/infrastructure/repositories/DatabaseTenantRepository";

const tenantRepository = new DatabaseTenantRepository();
const credentialRepository = new DatabaseTenantCredentialRepository(
  defaultEncryptionProvider,
);
const encryptedCredentialProvider = new EncryptedTenantCredentialProvider(
  tenantRepository,
  credentialRepository,
  defaultEncryptionProvider,
);
const tenantMoodleClientFactory = new MoodleClientFactory(
  encryptedCredentialProvider,
);
const connectionTester = new MoodleTenantConnectionTester(
  tenantMoodleClientFactory,
);

export function createTenantDependencies() {
  const getTenantUseCase = new GetTenantUseCase(tenantRepository);
  const getTenantBySlugUseCase = new GetTenantBySlugUseCase(tenantRepository);
  const createTenantUseCase = new CreateTenantUseCase(
    tenantRepository,
    credentialRepository,
    defaultEncryptionProvider,
  );
  const updateTenantUseCase = new UpdateTenantUseCase(
    tenantRepository,
    credentialRepository,
    defaultEncryptionProvider,
  );
  const changeTenantStatusUseCase = new ChangeTenantStatusUseCase(
    tenantRepository,
  );
  const testTenantMoodleConnectionUseCase =
    new TestTenantMoodleConnectionUseCase(tenantRepository, connectionTester);

  return {
    tenantRepository,
    credentialRepository,
    encryptedCredentialProvider,
    tenantMoodleClientFactory,
    connectionTester,
    getTenantUseCase,
    getTenantBySlugUseCase,
    createTenantUseCase,
    updateTenantUseCase,
    changeTenantStatusUseCase,
    testTenantMoodleConnectionUseCase,
  };
}
