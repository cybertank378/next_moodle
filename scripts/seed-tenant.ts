import { randomUUID } from "crypto";
import { AesHkdfEncryptionProvider } from "../src/core/security/AesHkdfEncryptionProvider";
import {
  connectPrisma,
  disconnectPrisma,
  getPrismaClient,
} from "../src/libs/prisma";

async function main() {
  const prisma = getPrismaClient();
  await connectPrisma();

  // Hapus jika tenant localhost sudah ada agar tidak error duplicate
  await prisma.tenant.deleteMany({
    where: { slug: "localhost" },
  });

  const encryption = new AesHkdfEncryptionProvider();
  const tenantId = randomUUID();
  const encryptedToken = await encryption.encrypt(
    "dummy-admin-token",
    tenantId,
  );

  // Moodle URL Anda yang sebenarnya
  const MOODLE_URL = "http://localhost/moodle"; // UBAH INI JIKA URL MOODLE ANDA BERBEDA!

  await prisma.tenant.create({
    data: {
      id: tenantId,
      slug: "localhost",
      name: "Localhost Tenant",
      customDomain: "localhost",
      status: "ACTIVE",
      credential: {
        create: {
          moodleUrl: MOODLE_URL,
          encryptedAdminToken: encryptedToken,
        },
      },
    },
  });

  console.log(`✅ Berhasil membuat data tenant 'localhost'!`);
  console.log(`✅ Moodle URL di-set ke: ${MOODLE_URL}`);

  await disconnectPrisma();
}

main().catch(console.error);
