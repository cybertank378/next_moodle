import {describe,it,expect,vi} from "vitest";
const create=vi.hoisted(()=>vi.fn().mockResolvedValue({id:"audit1"}));
vi.mock("@/libs/prisma",()=>({prisma:{saasAuditLog:{create}}}));
import {recordSaasAudit} from "@/modules/audit/infrastructure/repo/SaasAuditWriter";
describe("SaaS audit writer",()=>{it("writes allowlisted details into saasAuditLog",async()=>{await recordSaasAudit({actor:{userId:"a",username:"a",role:"ADMIN",tenantId:null},tenantId:"t1",action:"tenant.update",resource:"tenant",details:{event:"tenant.updated",password:"secret"}});expect(create).toHaveBeenCalledWith({data:expect.objectContaining({tenantId:"t1",actorId:"a",details:{event:"tenant.updated"}})})})});
