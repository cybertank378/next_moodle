import {describe,expect,it} from "vitest";
import {DEFAULT_PLATFORM_SETTINGS} from "@/modules/settings/domain/entity/PlatformSettings";
import {validatePlatformSettingsUpdate} from "@/modules/settings/domain/validators/validatePlatformSettings";

const input={...DEFAULT_PLATFORM_SETTINGS,expectedRevision:1};
describe("platform settings validation",()=>{
 it("accepts defaults",()=>expect(validatePlatformSettingsUpdate(input)).toMatchObject(input));
 it.each([
   {...input,applicationName:" "},
   {...input,applicationShortName:""},
   {...input,pwaThemeColor:"#abc"},
   {...input,supportEmail:"broken@"},
   {...input,supportUrl:"http://example.org"},
   {...input,supportUrl:"https://user:pass@example.org"},
   {...input,expectedRevision:0},
   {...input,tenantId:"foreign"},
 ])("rejects invalid or unauthorized input %#",value=>{
   expect(()=>validatePlatformSettingsUpdate(value)).toThrow();
 });
});
