import type {PlatformSettingsDTO} from "@/modules/settings/domain/dto/PlatformSettingsDTO";
import {SettingsManagementView} from "@/sections/settings/organisms/SettingsManagementView";
export default function SettingsPageView({initial}:{initial:PlatformSettingsDTO}){
  return <SettingsManagementView initial={initial}/>;
}
