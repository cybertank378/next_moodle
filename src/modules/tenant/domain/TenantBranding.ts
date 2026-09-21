export interface TenantBrandingProps {
  id: string;
  tenantId: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  accentColor?: string | null;
  faviconUrl?: string | null;
  customCss?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
