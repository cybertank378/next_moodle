import { APP_DESCRIPTION, APP_NAME } from "@/libs/branding";
import type { PlatformSettingsFields } from "@/modules/settings/domain/dto/PlatformSettingsDTO";

export const DEFAULT_PLATFORM_SETTINGS: Readonly<PlatformSettingsFields> = Object.freeze({
  applicationName: APP_NAME,
  applicationShortName: APP_NAME,
  applicationDescription: APP_DESCRIPTION,
  supportEmail: null,
  supportUrl: null,
  pwaThemeColor: "#082d61",
  pwaBackgroundColor: "#ffffff",
});

export const PLATFORM_SETTINGS_ID = "platform";
