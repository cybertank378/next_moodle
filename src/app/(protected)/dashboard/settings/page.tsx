import {requireDashboardRoles} from "@/modules/auth/server/requireDashboardRoles";
import {loadSettingsInitialData} from "@/modules/settings/presentation/server/loadSettingsInitialData";
import SettingsPageView from "@/sections/settings/pages/SettingsPageView";
export default async function SettingsPage(){
  const actor=await requireDashboardRoles(["ADMIN"]);
  if(!actor)return null;
  const initial=await loadSettingsInitialData(actor);
  return <SettingsPageView initial={initial}/>;
}
