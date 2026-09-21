import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Prisma Schema Multi-tenant Architecture Compliance", () => {
  const schemaPath = path.resolve(process.cwd(), "prisma/schema.prisma");

  it("should have valid schema.prisma file", () => {
    expect(fs.existsSync(schemaPath)).toBe(true);
  });

  it("should define all mandatory SaaS operational models", () => {
    const schema = fs.readFileSync(schemaPath, "utf-8");

    expect(schema).toMatch(/model\s+Tenant\s+{/);
    expect(schema).toMatch(/model\s+TenantCredential\s+{/);
    expect(schema).toMatch(/model\s+TenantBranding\s+{/);
    expect(schema).toMatch(/model\s+SaasAuditLog\s+{/);
    expect(schema).toMatch(/enum\s+TenantStatus\s+{/);
  });

  it("must NEVER duplicate Moodle academic entities as source of truth", () => {
    const schema = fs.readFileSync(schemaPath, "utf-8");

    // Strictly forbidden academic models
    expect(schema).not.toMatch(/model\s+Course\s+{/i);
    expect(schema).not.toMatch(/model\s+Quiz\s+{/i);
    expect(schema).not.toMatch(/model\s+Question\s+{/i);
    expect(schema).not.toMatch(/model\s+Attempt\s+{/i);
    expect(schema).not.toMatch(/model\s+QuizAttempt\s+{/i);
    expect(schema).not.toMatch(/model\s+Grade\s+{/i);
    expect(schema).not.toMatch(/model\s+Enrolment\s+{/i);

    // Strictly forbidden academic credentials
    expect(schema).not.toMatch(/password/i);
    expect(schema).not.toMatch(/moodlePassword/i);
  });

  it("should have unique slug and proper cascade relations", () => {
    const schema = fs.readFileSync(schemaPath, "utf-8");

    expect(schema).toMatch(/slug\s+String\s+@unique/);
    expect(schema).toMatch(/onDelete:\s*Cascade/);
  });
});
