import type { MetadataRoute } from "next";
import { loadPublicPlatformSettings } from "@/modules/settings/presentation/server/loadPublicPlatformSettings";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings=await loadPublicPlatformSettings();
  return {
    name:settings.applicationName,short_name:settings.applicationShortName,
    description:settings.applicationDescription,
    start_url:"/",scope:"/",display:"standalone",
    background_color:settings.pwaBackgroundColor,theme_color:settings.pwaThemeColor,
    icons:[
      {src:"/assets/images/logo/web-app-manifest-192x192.png",sizes:"192x192",type:"image/png",purpose:"any"},
      {src:"/assets/images/logo/web-app-manifest-512x512.png",sizes:"512x512",type:"image/png",purpose:"maskable"},
    ],
  };
}
