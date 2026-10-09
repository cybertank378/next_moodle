import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";
import pg from "pg";

const { Pool } = pg;

async function main() {
  const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:Natoar23ae@localhost:5432/next_moodle_saas?schema=public";
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Connecting to Database...");
    await prisma.$connect();

    // Hapus tenant lama jika ada
    await prisma.tenant.deleteMany({
      where: { slug: "localhost" },
    });

    const tenantId = randomUUID();

    // 🔴 GANTI URL INI DENGAN URL MOODLE LOKAL ANDA
    const MOODLE_URL = "http://moodle.local";

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
            encryptedAdminToken: "dummy-token-for-testing",
          },
        },
      },
    });

    console.log("✅ Berhasil membuat tenant 'localhost'!");
    console.log(`✅ URL Moodle untuk tenant ini diatur ke: ${MOODLE_URL}`);
    console.log(
      "Buka file scripts/seed-tenant.mjs dan jalankan lagi jika URL Moodle Anda berbeda.",
    );
  } catch (e) {
    console.error("❌ Gagal membuat tenant:", e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
