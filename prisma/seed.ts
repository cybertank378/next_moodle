import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pg from "pg";
import { TenantSeeder } from "./seeders/TenantSeeder";

const { Pool } = pg;

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined in the environment.");
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Starting database seeding...");

  try {
    const tenantSeeder = new TenantSeeder(prisma);
    await tenantSeeder.run();

    // Tambahkan eksekusi seeder lain di sini secara berurutan
    // const courseSeeder = new CourseSeeder(prisma);
    // await courseSeeder.run();

    console.log("✅ Seeding completed successfully.");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
