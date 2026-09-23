import type { PrismaClient } from "@prisma/client";
import { Tenant } from "@/modules/tenants/domain/entities/Tenant";
import type {
  TenantCredentialPersistenceInput,
  TenantsRepository,
} from "@/modules/tenants/domain/interfaces/TenantsInterfaces";
import type {
  TenantListFilter,
  TenantStatus,
} from "@/modules/tenants/domain/types/TenantTypes";

type TenantRecord = {
  id: string;
  slug: string;
  name: string;
  status: TenantStatus;
  customDomain: string | null;
  createdAt: Date;
  updatedAt: Date;
  credential: {
    moodleUrl: string;
    encryptedAdminToken: string;
    encryptedProctorToken: string | null;
    timeoutBudgetMs: number;
    sslVerify: boolean;
    updatedAt: Date;
  } | null;
  branding: {
    logoUrl: string | null;
    primaryColor: string | null;
    accentColor: string | null;
    faviconUrl: string | null;
  } | null;
};

const includeRelations = {
  credential: true,
  branding: true,
} as const;

function toDomain(record: TenantRecord): Tenant {
  return new Tenant({
    id: record.id,
    slug: record.slug,
    name: record.name,
    status: record.status,
    customDomain: record.customDomain,
    credential: record.credential
      ? {
          moodleUrl: record.credential.moodleUrl,
          timeoutBudgetMs: record.credential.timeoutBudgetMs,
          sslVerify: record.credential.sslVerify,
          hasAdminToken: record.credential.encryptedAdminToken.length > 0,
          hasProctorToken: Boolean(record.credential.encryptedProctorToken),
          configuredAt: record.credential.updatedAt,
        }
      : null,
    branding: record.branding
      ? {
          logoUrl: record.branding.logoUrl,
          primaryColor: record.branding.primaryColor,
          accentColor: record.branding.accentColor,
          faviconUrl: record.branding.faviconUrl,
        }
      : null,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  });
}

function buildWhere(filter: Pick<TenantListFilter, "status" | "search">) {
  const search = filter.search?.trim();
  return {
    ...(filter.status ? { status: filter.status } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { slug: { contains: search, mode: "insensitive" as const } },
            {
              customDomain: { contains: search, mode: "insensitive" as const },
            },
          ],
        }
      : {}),
  };
}

export class PrismaTenantsRepository implements TenantsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Tenant | null> {
    const record = await this.prisma.tenant.findUnique({
      where: { id },
      include: includeRelations,
    });
    return record ? toDomain(record as TenantRecord) : null;
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    const record = await this.prisma.tenant.findUnique({
      where: { slug },
      include: includeRelations,
    });
    return record ? toDomain(record as TenantRecord) : null;
  }

  async findByCustomDomain(customDomain: string): Promise<Tenant | null> {
    const record = await this.prisma.tenant.findUnique({
      where: { customDomain },
      include: includeRelations,
    });
    return record ? toDomain(record as TenantRecord) : null;
  }

  async list(filter: TenantListFilter): Promise<Tenant[]> {
    const records = await this.prisma.tenant.findMany({
      where: buildWhere(filter),
      include: includeRelations,
      orderBy: { createdAt: "desc" },
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
    });
    return records.map((record) => toDomain(record as TenantRecord));
  }

  async count(
    filter: Pick<TenantListFilter, "status" | "search">,
  ): Promise<number> {
    return this.prisma.tenant.count({ where: buildWhere(filter) });
  }

  async create(tenant: Tenant): Promise<Tenant> {
    const record = await this.prisma.tenant.create({
      data: {
        id: tenant.id,
        slug: tenant.slug,
        name: tenant.name,
        status: tenant.status,
        customDomain: tenant.customDomain,
      },
      include: includeRelations,
    });
    return toDomain(record as TenantRecord);
  }

  async update(tenant: Tenant): Promise<Tenant> {
    const record = await this.prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        name: tenant.name,
        status: tenant.status,
        customDomain: tenant.customDomain,
      },
      include: includeRelations,
    });
    return toDomain(record as TenantRecord);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tenant.delete({ where: { id } });
  }

  async upsertCredential(
    input: TenantCredentialPersistenceInput,
  ): Promise<Tenant> {
    await this.prisma.tenantCredential.upsert({
      where: { tenantId: input.tenantId },
      create: {
        tenantId: input.tenantId,
        moodleUrl: input.moodleUrl,
        encryptedAdminToken: input.encryptedAdminToken,
        encryptedProctorToken: input.encryptedProctorToken,
        timeoutBudgetMs: input.timeoutBudgetMs,
        sslVerify: input.sslVerify,
      },
      update: {
        moodleUrl: input.moodleUrl,
        encryptedAdminToken: input.encryptedAdminToken,
        encryptedProctorToken: input.encryptedProctorToken,
        timeoutBudgetMs: input.timeoutBudgetMs,
        sslVerify: input.sslVerify,
      },
    });

    const tenant = await this.findById(input.tenantId);
    if (!tenant) {
      throw new Error("Tenant disappeared after credential persistence.");
    }
    return tenant;
  }
}
