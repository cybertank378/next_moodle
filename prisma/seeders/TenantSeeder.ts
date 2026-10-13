import { randomUUID } from "node:crypto";
import type { PrismaClient } from "@prisma/client";

export class TenantSeeder {
  constructor(private prisma: PrismaClient) {}

  public async run() {
    console.log("Seeding tenants...");

    // Remove existing if any
    await this.prisma.tenant.deleteMany({
      where: {
        slug: {
          in: ["localhost", "inactive-school"],
        },
      },
    });

    const tenantId = randomUUID();
    const MOODLE_URL = process.env.MOODLE_URL || "http://moodle.local";

    await this.prisma.tenant.create({
      data: {
        id: tenantId,
        slug: "localhost",
        name: "Localhost Tenant",
        customDomain: "localhost",
        status: "ACTIVE",
        credential: {
          create: {
            moodleUrl: MOODLE_URL,
            encryptedAdminToken: "373de4133fc7db67664bd7f4e1551a37",
          },
        },
      },
    });

    // Seed non-active (SUSPENDED) tenant to ensure suspended tenants cannot access the system
    const inactiveTenantId = randomUUID();
    await this.prisma.tenant.create({
      data: {
        id: inactiveTenantId,
        slug: "inactive-school",
        name: "Inactive School (Suspended)",
        customDomain: "inactive.local",
        status: "SUSPENDED",
        credential: {
          create: {
            moodleUrl: MOODLE_URL,
            encryptedAdminToken: "373de4133fc7db67664bd7f4e1551a37",
          },
        },
      },
    });

    console.log(`✅ Tenant 'localhost' created! (Moodle URL: ${MOODLE_URL})`);
    console.log(
      `✅ Non-active Tenant 'inactive-school' created with status SUSPENDED!`,
    );
  }
}
