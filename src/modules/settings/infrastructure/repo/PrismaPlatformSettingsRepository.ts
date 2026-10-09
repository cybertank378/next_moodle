import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/libs/prisma";
import { DEFAULT_PLATFORM_SETTINGS, PLATFORM_SETTINGS_ID } from "@/modules/settings/domain/entity/PlatformSettings";
import type { PlatformSettingsDTO, UpdatePlatformSettingsDTO } from "@/modules/settings/domain/dto/PlatformSettingsDTO";
import type { PlatformSettingsRepositoryInterface } from "@/modules/settings/domain/interfaces/PlatformSettingsRepositoryInterface";

function mapSettings(row: {
  applicationName: string; applicationShortName: string; applicationDescription: string;
  supportEmail: string | null; supportUrl: string | null;
  pwaThemeColor: string; pwaBackgroundColor: string;
  revision: number; updatedAt: Date;
}): PlatformSettingsDTO {
  return {
    applicationName: row.applicationName,
    applicationShortName: row.applicationShortName,
    applicationDescription: row.applicationDescription,
    supportEmail: row.supportEmail,
    supportUrl: row.supportUrl,
    pwaThemeColor: row.pwaThemeColor,
    pwaBackgroundColor: row.pwaBackgroundColor,
    revision: row.revision,
    updatedAt: row.updatedAt.toISOString(),
  };
}
const editableKeys = [
  "applicationName", "applicationShortName", "applicationDescription",
  "supportEmail", "supportUrl", "pwaThemeColor", "pwaBackgroundColor",
] as const;

export class PrismaPlatformSettingsRepository implements PlatformSettingsRepositoryInterface {
  async get(): Promise<PlatformSettingsDTO> {
    const row = await prisma.platformSettings.findUnique({ where: { id: PLATFORM_SETTINGS_ID } });
    return row ? mapSettings(row) : { ...DEFAULT_PLATFORM_SETTINGS, revision: 1, updatedAt: new Date(0).toISOString() };
  }

  async update(input: UpdatePlatformSettingsDTO, actorId: string): Promise<PlatformSettingsDTO> {
    const result = await prisma.$transaction(async tx => {
      const current = await tx.platformSettings.findUnique({where:{id:PLATFORM_SETTINGS_ID}});
      // No-op calls still verify revision to prevent stale clients appearing successful.
      const revision = current?.revision ?? 1;
      if (revision !== input.expectedRevision) return {kind:"conflict" as const};
      const changed = editableKeys.filter(key => (current?.[key] ?? DEFAULT_PLATFORM_SETTINGS[key]) !== input[key]);
      if (changed.length === 0) return {kind:"unchanged" as const, row:current};
      const data = Object.fromEntries(editableKeys.map(key=>[key,input[key]])) as Pick<UpdatePlatformSettingsDTO,typeof editableKeys[number]>;
      const updated = current
        ? await tx.platformSettings.updateMany({
            where:{id:PLATFORM_SETTINGS_ID,revision:input.expectedRevision},
            data:{...data,revision:{increment:1},updatedById:actorId},
          })
        : null;
      if (current && updated?.count !== 1) return {kind:"conflict" as const};
      let row;
      if (current) row = await tx.platformSettings.findUniqueOrThrow({where:{id:PLATFORM_SETTINGS_ID}});
      else {
        try {
          row = await tx.platformSettings.create({
            data:{id:PLATFORM_SETTINGS_ID,...data,revision:2,updatedById:actorId},
          });
        } catch (error) {
          if (typeof error === "object" && error !== null && "code" in error && error.code==="P2002") return {kind:"conflict" as const};
          throw error;
        }
      }
      const before: Record<string,unknown> = {};
      const after: Record<string,unknown> = {};
      for(const key of changed){
        before[key]=current?.[key]??DEFAULT_PLATFORM_SETTINGS[key];
        after[key]=row[key];
      }
      // Audit is persisted within the same transaction. Do not expose private contact details in audit.
      await tx.saasAuditLog.create({data:{
        tenantId:null,actorId,actorRole:"ADMIN",action:"platform.settings.update",
        resource:"platform_settings",resourceId:PLATFORM_SETTINGS_ID,
        details:{event:"platform.settings.update",changedFields:changed,
          previousRevision:revision,nextRevision:row.revision} as Prisma.InputJsonObject,
      }});
      return {kind:"updated" as const,row};
    });
    if(result.kind==="conflict"){
      const error = new Error("Pengaturan sudah diperbarui oleh administrator lain. Muat ulang versi terbaru sebelum menyimpan.");
      Object.assign(error,{code:"SETTINGS_CONFLICT",statusCode:409});
      throw error;
    }
    if(result.kind==="unchanged") {
      return result.row ? mapSettings(result.row) : this.get();
    }
    return mapSettings(result.row);
  }
}
