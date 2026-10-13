import {describe,expect,it,vi} from "vitest";
import {GetPlatformSettingsUseCase} from "@/modules/settings/application/usecases/GetPlatformSettingsUseCase";
import {UpdatePlatformSettingsUseCase} from "@/modules/settings/application/usecases/UpdatePlatformSettingsUseCase";
import {DEFAULT_PLATFORM_SETTINGS} from "@/modules/settings/domain/entity/PlatformSettings";
import type {PlatformSettingsRepositoryInterface} from "@/modules/settings/domain/interfaces/PlatformSettingsRepositoryInterface";
const admin={userId:"admin",username:"admin",role:"ADMIN",tenantId:null};
const settings={...DEFAULT_PLATFORM_SETTINGS,revision:1,updatedAt:new Date(0).toISOString()};
describe("settings usecases",()=>{
 it("reads through repository",async()=>{
   const repository:PlatformSettingsRepositoryInterface={get:vi.fn().mockResolvedValue(settings),update:vi.fn()};
   await expect(new GetPlatformSettingsUseCase(repository).execute(admin)).resolves.toEqual(settings);
 });
 it("validates before repository mutation",async()=>{
   const repository:PlatformSettingsRepositoryInterface={get:vi.fn(),update:vi.fn()};
   await expect(new UpdatePlatformSettingsUseCase(repository).execute(admin,{...DEFAULT_PLATFORM_SETTINGS,expectedRevision:1,actorId:"forged"})).rejects.toThrow();
   expect(repository.update).not.toHaveBeenCalled();
 });
 it("updates as verified admin only",async()=>{
   const repository:PlatformSettingsRepositoryInterface={get:vi.fn(),update:vi.fn().mockResolvedValue(settings)};
   await new UpdatePlatformSettingsUseCase(repository).execute(admin,{...DEFAULT_PLATFORM_SETTINGS,expectedRevision:1});
   expect(repository.update).toHaveBeenCalledWith(expect.objectContaining({expectedRevision:1}),"admin");
 });
});
