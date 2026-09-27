import { getPrismaClient, connectPrisma, disconnectPrisma } from './src/libs/prisma';

async function main() {
  const prisma = getPrismaClient();
  try {
    console.log("1. Checking Database (Prisma) connection...");
    await connectPrisma();
    console.log("✅ Database connection successful.");

    console.log("\n2. Fetching tenant 'localhost'...");
    const tenant = await prisma.tenant.findFirst({
      where: { OR: [{ slug: 'localhost' }, { customDomain: 'localhost' }] },
      include: { credential: true },
    });
    
    if (!tenant) {
      console.log("❌ Tenant 'localhost' NOT FOUND in database!");
      return;
    }
    
    console.log("✅ Tenant found:", tenant.slug);
    if (!tenant.credential) {
      console.log("❌ Tenant has no Moodle credential configured!");
      return;
    }
    console.log("✅ Tenant Moodle URL:", tenant.credential.moodleUrl);
    
    console.log("\n3. Checking Moodle connection...");
    const url = new URL("/login/token.php", tenant.credential.moodleUrl).toString();
    try {
      const resp = await fetch(url, { method: "POST" });
      console.log("✅ Moodle connection successful.");
      console.log("Moodle HTTP Status:", resp.status);
      const text = await resp.text();
      console.log("Moodle Response (first 100 chars):", text.substring(0, 100).replace(/\n/g, ""));
    } catch (e) {
      console.log("❌ Moodle connection failed:", e.message);
    }

  } catch(e) {
    console.error("❌ Prisma Error:", e);
  } finally {
    await disconnectPrisma();
  }
}

main();
