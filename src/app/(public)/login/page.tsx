import AuthSection from "@/sections/auth/pages/AuthPage";
import {loadPublicPlatformSettings} from "@/modules/settings/presentation/server/loadPublicPlatformSettings";
export default async function LoginPage(){
  const settings=await loadPublicPlatformSettings();
  return <AuthSection mode="login" platformSettings={settings}/>;
}
