import { beforeEach, describe, expect, it } from "vitest";
import { ConflictError } from "@/core/errors/ConflictError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { ChangeTenantStatusUseCase } from "../../application/usecases/ChangeTenantStatusUseCase";
import { CreateTenantUseCase } from "../../application/usecases/CreateTenantUseCase";
import { GetTenantBySlugUseCase } from "../../application/usecases/GetTenantBySlugUseCase";
import { GetTenantUseCase } from "../../application/usecases/GetTenantUseCase";
import { TestTenantMoodleConnectionUseCase } from "../../application/usecases/TestTenantMoodleConnectionUseCase";
import { UpdateTenantUseCase } from "../../application/usecases/UpdateTenantUseCase";
import { AesGcmEncryptionProvider } from "../../infrastructure/providers/AesGcmEncryptionProvider";
import { DatabaseTenantCredentialRepository } from "../../infrastructure/repositories/DatabaseTenantCredentialRepository";
import { DatabaseTenantRepository } from "../../infrastructure/repositories/DatabaseTenantRepository";

describe("Tenant Application Use Cases", () => {
  let tenantRepo: DatabaseTenantRepository;
  let credRepo: DatabaseTenantCredentialRepository;
  let encryptionProvider: AesGcmEncryptionProvider;

  beforeEach(() => {
    encryptionProvider = new AesGcmEncryptionProvider(
      "test-secret-encryption-key-application-suite-32!",
    );
    tenantRepo = new DatabaseTenantRepository();
    credRepo = new DatabaseTenantCredentialRepository(encryptionProvider);
  });

  describe("CreateTenantUseCase", () => {
    it("should create a new tenant and save encrypted credential without leaking secrets in response", async () => {
      const useCase = new CreateTenantUseCase(
        tenantRepo,
        credRepo,
        encryptionProvider,
      );

      const result = await useCase.execute({
        slug: "smpn-1-jakarta",
        name: "SMPN 1 Jakarta",
        moodleBaseUrl: "https://moodle.smpn1.sch.id",
        moodleToken: "super_secret_token_abc123",
        moodleServiceShortname: "exam_service",
      });

      expect(result.id).toBeDefined();
      expect(result.slug).toBe("smpn-1-jakarta");
      expect(result.name).toBe("SMPN 1 Jakarta");
      expect(result.status).toBe("ACTIVE");
      expect(result.moodle?.configured).toBe(true);
      expect(result.moodle?.baseUrl).toBe("https://moodle.smpn1.sch.id");

      // Verify no secret leakage
      // @ts-expect-error - token should not exist on response DTO
      expect(result.moodleToken).toBeUndefined();
      // @ts-expect-error - encryptedToken should not exist on response DTO
      expect(result.encryptedToken).toBeUndefined();

      // Verify credential is encrypted in repository
      const savedCred = await credRepo.getByTenantId(result.id);
      expect(savedCred).not.toBeNull();
      if (!savedCred) throw new Error("Credential not found");
      expect(savedCred.encryptedToken).not.toBe("super_secret_token_abc123");

      const decrypted = encryptionProvider.decrypt({
        encryptedValue: savedCred.encryptedToken,
        iv: savedCred.iv,
        authTag: savedCred.authTag,
        keyVersion: savedCred.keyVersion,
      });
      expect(decrypted).toBe("super_secret_token_abc123");
    });

    it("should reject duplicate tenant slug", async () => {
      const useCase = new CreateTenantUseCase(
        tenantRepo,
        credRepo,
        encryptionProvider,
      );

      await useCase.execute({
        slug: "unique-school",
        name: "Unique School",
        moodleBaseUrl: "https://moodle.unique.test",
        moodleToken: "token_1",
      });

      await expect(
        useCase.execute({
          slug: "unique-school",
          name: "Another School with same slug",
          moodleBaseUrl: "https://moodle.another.test",
          moodleToken: "token_2",
        }),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe("UpdateTenantUseCase", () => {
    it("should update metadata and preserve existing token when moodleToken is omitted", async () => {
      const createUseCase = new CreateTenantUseCase(
        tenantRepo,
        credRepo,
        encryptionProvider,
      );
      const created = await createUseCase.execute({
        slug: "school-update-test",
        name: "Initial Name",
        moodleBaseUrl: "https://moodle.initial.test",
        moodleToken: "original_secret_token",
      });

      const updateUseCase = new UpdateTenantUseCase(
        tenantRepo,
        credRepo,
        encryptionProvider,
      );
      const updated = await updateUseCase.execute(created.id, {
        name: "Updated Name",
      });

      expect(updated.name).toBe("Updated Name");

      // Credential must remain preserved
      const cred = await credRepo.getByTenantId(created.id);
      expect(cred).not.toBeNull();
      if (!cred) throw new Error("Credential not found");
      const decrypted = encryptionProvider.decrypt({
        encryptedValue: cred.encryptedToken,
        iv: cred.iv,
        authTag: cred.authTag,
        keyVersion: cred.keyVersion,
      });
      expect(decrypted).toBe("original_secret_token");
    });

    it("should update credential when new moodleToken is provided", async () => {
      const createUseCase = new CreateTenantUseCase(
        tenantRepo,
        credRepo,
        encryptionProvider,
      );
      const created = await createUseCase.execute({
        slug: "school-token-update",
        name: "Token School",
        moodleBaseUrl: "https://moodle.test",
        moodleToken: "old_token",
      });

      const updateUseCase = new UpdateTenantUseCase(
        tenantRepo,
        credRepo,
        encryptionProvider,
      );
      await updateUseCase.execute(created.id, {
        moodleToken: "new_refreshed_token",
      });

      const cred = await credRepo.getByTenantId(created.id);
      expect(cred).not.toBeNull();
      if (!cred) throw new Error("Credential not found");
      const decrypted = encryptionProvider.decrypt({
        encryptedValue: cred.encryptedToken,
        iv: cred.iv,
        authTag: cred.authTag,
        keyVersion: cred.keyVersion,
      });
      expect(decrypted).toBe("new_refreshed_token");
    });
  });

  describe("GetTenantUseCase & GetTenantBySlugUseCase", () => {
    it("should return tenant by id and by slug", async () => {
      const getUseCase = new GetTenantUseCase(tenantRepo);
      const getBySlugUseCase = new GetTenantBySlugUseCase(tenantRepo);

      // Demo tenant was seeded
      const tenantById = await getUseCase.execute("tenant_demo");
      expect(tenantById.slug).toBe("demo");

      const tenantBySlug = await getBySlugUseCase.execute("demo");
      expect(tenantBySlug.id).toBe("tenant_demo");
    });

    it("should throw NotFoundError if tenant not found", async () => {
      const getUseCase = new GetTenantUseCase(tenantRepo);
      await expect(getUseCase.execute("non_existent")).rejects.toThrow(
        NotFoundError,
      );

      const getBySlugUseCase = new GetTenantBySlugUseCase(tenantRepo);
      await expect(
        getBySlugUseCase.execute("non_existent_slug"),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("ChangeTenantStatusUseCase", () => {
    it("should successfully transition tenant status", async () => {
      const changeStatusUseCase = new ChangeTenantStatusUseCase(tenantRepo);

      const updated = await changeStatusUseCase.execute({
        tenantId: "tenant_demo",
        status: "SUSPENDED",
      });

      expect(updated.status).toBe("SUSPENDED");

      const found = await tenantRepo.findById("tenant_demo");
      expect(found?.status).toBe("SUSPENDED");
    });
  });

  describe("TestTenantMoodleConnectionUseCase", () => {
    it("should invoke tester and return safe report", async () => {
      const mockTester = {
        testConnection: async () => ({
          success: true,
          message: "Koneksi berhasil",
          siteName: "Moodle Demo",
          moodleVersion: "4.3",
        }),
      };

      const useCase = new TestTenantMoodleConnectionUseCase(
        tenantRepo,
        mockTester,
      );

      const result = await useCase.execute("tenant_demo");
      expect(result.success).toBe(true);
      expect(result.siteName).toBe("Moodle Demo");
    });
  });
});
