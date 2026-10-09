export interface PlatformSettingsFields {
  applicationName: string;
  applicationShortName: string;
  applicationDescription: string;
  supportEmail: string | null;
  supportUrl: string | null;
  pwaThemeColor: string;
  pwaBackgroundColor: string;
}

export interface PlatformSettingsDTO extends PlatformSettingsFields {
  revision: number;
  updatedAt: string;
}

export interface UpdatePlatformSettingsDTO extends PlatformSettingsFields {
  expectedRevision: number;
}

export type PublicPlatformSettingsDTO = PlatformSettingsFields;
