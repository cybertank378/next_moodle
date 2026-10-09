import {describe,expect,it} from "vitest";
import {authorizeSettings} from "@/modules/settings/application/services/SettingsAuthorization";
import type {CurrentActor} from "@/core/auth/CurrentActor";
const makeActor=(role:string,tenantId:string|null):CurrentActor=>({userId:"test",username:"test",role,tenantId});
describe("settings authorization",()=>{
 it.each(["read","update"] as const)("allows platform ADMIN %s",action=>{
   expect(()=>authorizeSettings(makeActor("ADMIN",null),action)).not.toThrow();
 });
 it.each(["TENANT","STUDENT","TEACHER","PROCTOR"])("denies %s",role=>{
   expect(()=>authorizeSettings(makeActor(role,"tenant-a"),"read")).toThrow();
   expect(()=>authorizeSettings(makeActor(role,"tenant-b"),"update")).toThrow();
 });
 it("denies anonymous access",()=>expect(()=>authorizeSettings(null,"read")).toThrow());
});
