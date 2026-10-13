import "@/styles/globals.css";
import "katex/dist/katex.min.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { loadPublicPlatformSettings } from "@/modules/settings/presentation/server/loadPublicPlatformSettings";
import AppToastProvider from "@/shared-ui/layout/AppToastProvider";

export async function generateMetadata(): Promise<Metadata> {
  const s=await loadPublicPlatformSettings();
  return {
    title:{default:s.applicationName,template:`%s | ${s.applicationName}`},
    applicationName:s.applicationName,
    description:s.applicationDescription,
    manifest:"/manifest.webmanifest",
    openGraph:{description:s.applicationDescription,siteName:s.applicationName,title:s.applicationName,type:"website"},
    twitter:{card:"summary",description:s.applicationDescription,title:s.applicationName},
  };
}

export default function RootLayout({children}:{children:ReactNode}){
  return <html lang="id" suppressHydrationWarning><body className="bg-slate-50 text-slate-900 antialiased transition-colors duration-200"><AppToastProvider>{children}</AppToastProvider></body></html>;
}
