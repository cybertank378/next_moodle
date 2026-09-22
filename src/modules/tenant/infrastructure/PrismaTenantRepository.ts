import type { PrismaClient } from "@prisma/client";
import { Tenant, type TenantDomainStatus } from "../domain/Tenant";
import type {
  TenantFindAllOptions,
  TenantRepository,
} from "../domain/TenantRepository";

type PrismaTenantWithRelations = {
  id: string;
  slug: string;
  name: string;
  status: "ACTIVE" | "MAINTENANCE" | "SUSPENDED";
  customDomain: string | null;
  createdAt: Date;
  updatedAt: Date;
  credential?: {
    id: string;
    tenantId: string;
    moodleUrl: string;
    encryptedAdminToken: string;
    encryptedProctorToken: string | null;
    timeoutBudgetMs: number;
    sslVerify: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  branding?: {
    id: string;
    tenantId: string;
    logoUrl: string | null;
    primaryColor: string | null;
    accentColor: string | null;
    faviconUrl: string | null;
    customCss: string | null;
    createdAt: Date;
    updatedAt: Date;
  } | null;
};

export class PrismaTenantRepository implements TenantRepository {
  constructor(private readonly prisma: PrismaClient) {}

  private toDomain(record: PrismaTenantWithRelations): Tenant {
    return new Tenant({
      id: record.id,
      slug: record.slug,
      name: record.name,
      status: record.status as TenantDomainStatus,
      customDomain: record.customDomain,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      credential: record.credential
        ? {
            id: record.credential.id,
            tenantId: record.credential.tenantId,
            moodleUrl: record.credential.moodleUrl,
            encryptedAdminToken: record.credential.encryptedAdminToken,
            encryptedProctorToken: record.credential.encryptedProctorToken,
            timeoutBudgetMs: record.credential.timeoutBudgetMs,
            sslVerify: record.credential.sslVerify,
            createdAt: record.credential.createdAt,
            updatedAt: record.credential.updatedAt,
          }
        : null,
      branding: record.branding
        ? {
            id: record.branding.id,
            tenantId: record.branding.tenantId,
            logoUrl: record.branding.logoUrl,
            primaryColor: record.branding.primaryColor,
            accentColor: record.branding.accentColor,
            faviconUrl: record.branding.faviconUrl,
            customCss: record.branding.customCss,
            createdAt: record.branding.createdAt,
            updatedAt: record.branding.updatedAt,
          }
        : null,
    });
  }

  private buildWhereClause(filter?: TenantFindAllOptions["filter"]) {
    if (!filter) return undefined;

    const where: Record<string, unknown> = {};

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: "insensitive" } },
        { slug: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    return Object.keys(where).length > 0 ? where : undefined;
  }

  async findById(id: string): Promise<Tenant | null> {
    const record = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        credential: true,
        branding: true,
      },
    });

    if (!record) return null;
    return this.toDomain(record as PrismaTenantWithRelations);
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    const record = await this.prisma.tenant.findUnique({
      where: { slug },
      include: {
        credential: true,
        branding: true,
      },
    });

    if (!record) return null;
    return this.toDomain(record as PrismaTenantWithRelations);
  }

  async findByCustomDomain(customDomain: string): Promise<Tenant | null> {
    const record = await this.prisma.tenant.findUnique({
      where: { customDomain },
      include: {
        credential: true,
        branding: true,
      },
    });

    if (!record) return null;
    return this.toDomain(record as PrismaTenantWithRelations);
  }

  async findAll(options?: TenantFindAllOptions): Promise<Tenant[]> {
    const filter = options?.filter;
    const page = Math.max(1, filter?.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, filter?.pageSize ?? 20));
    const skip = (page - 1) * pageSize;

    const where = this.buildWhereClause(filter);

    const records = await this.prisma.tenant.findMany({
      where,
      include: {
        credential: true,
        branding: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    });

    return records.map((r) => this.toDomain(r as PrismaTenantWithRelations));
  }

  async count(options?: {
    filter?: { status?: TenantDomainStatus; search?: string };
  }): Promise<number> {
    const where = this.buildWhereClause(options?.filter);
    return this.prisma.tenant.count({ where });
  }

  async save(tenant: Tenant): Promise<Tenant> {
    const upsertData = {
      slug: tenant.slug,
      name: tenant.name,
      status: tenant.status,
      customDomain: tenant.customDomain ?? null,
    };

    const record = await this.prisma.tenant.upsert({
      where: { id: tenant.id },
      create: {
        id: tenant.id,
        ...upsertData,
        credential: tenant.credential
          ? {
              create: {
                id: tenant.credential.id,
                moodleUrl: tenant.credential.moodleUrl,
                encryptedAdminToken: tenant.credential.encryptedAdminToken,
                encryptedProctorToken:
                  tenant.credential.encryptedProctorToken ?? null,
                timeoutBudgetMs: tenant.credential.timeoutBudgetMs,
                sslVerify: tenant.credential.sslVerify,
              },
            }
          : undefined,
        branding: tenant.branding
          ? {
              create: {
                id: tenant.branding.id,
                logoUrl: tenant.branding.logoUrl ?? null,
                primaryColor: tenant.branding.primaryColor ?? null,
                accentColor: tenant.branding.accentColor ?? null,
                faviconUrl: tenant.branding.faviconUrl ?? null,
                customCss: tenant.branding.customCss ?? null,
              },
            }
          : undefined,
      },
      update: {
        ...upsertData,
        credential: tenant.credential
          ? {
              upsert: {
                create: {
                  id: tenant.credential.id,
                  moodleUrl: tenant.credential.moodleUrl,
                  encryptedAdminToken: tenant.credential.encryptedAdminToken,
                  encryptedProctorToken:
                    tenant.credential.encryptedProctorToken ?? null,
                  timeoutBudgetMs: tenant.credential.timeoutBudgetMs,
                  sslVerify: tenant.credential.sslVerify,
                },
                update: {
                  moodleUrl: tenant.credential.moodleUrl,
                  encryptedAdminToken: tenant.credential.encryptedAdminToken,
                  encryptedProctorToken:
                    tenant.credential.encryptedProctorToken ?? null,
                  timeoutBudgetMs: tenant.credential.timeoutBudgetMs,
                  sslVerify: tenant.credential.sslVerify,
                },
              },
            }
          : undefined,
        branding: tenant.branding
          ? {
              upsert: {
                create: {
                  id: tenant.branding.id,
                  logoUrl: tenant.branding.logoUrl ?? null,
                  primaryColor: tenant.branding.primaryColor ?? null,
                  accentColor: tenant.branding.accentColor ?? null,
                  faviconUrl: tenant.branding.faviconUrl ?? null,
                  customCss: tenant.branding.customCss ?? null,
                },
                update: {
                  logoUrl: tenant.branding.logoUrl ?? null,
                  primaryColor: tenant.branding.primaryColor ?? null,
                  accentColor: tenant.branding.accentColor ?? null,
                  faviconUrl: tenant.branding.faviconUrl ?? null,
                  customCss: tenant.branding.customCss ?? null,
                },
              },
            }
          : undefined,
      },
      include: {
        credential: true,
        branding: true,
      },
    });

    return this.toDomain(record as PrismaTenantWithRelations);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tenant.delete({
      where: { id },
    });
  }
}
