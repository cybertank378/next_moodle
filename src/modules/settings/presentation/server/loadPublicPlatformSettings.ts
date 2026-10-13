import "server-only";
import { prisma } from "@/libs/prisma";
import { DEFAULT_PLATFORM_SETTINGS, PLATFORM_SETTINGS_ID } from "@/modules/settings/domain/entity/PlatformSettings";
import type { PublicPlatformSettingsDTO } from "@/modules/settings/domain/dto/PlatformSettingsDTO";

export async function loadPublicPlatformSettings(): Promise<PublicPlatformSettingsDTO> {
  const row = await prisma.platformSettings.findUnique({
    where:{id:PLATFORM_SETTINGS_ID},
    select:{
      applicationName:true,applicationShortName:true,applicationDescription:true,
      supportEmail:true,supportUrl:true,pwaThemeColor:true,pwaBackgroundColor:true,
    },
  });
  return row ?? {...DEFAULT_PLATFORM_SETTINGS};
}
