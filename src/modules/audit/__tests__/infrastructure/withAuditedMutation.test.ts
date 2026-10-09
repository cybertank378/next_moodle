import {describe,it,expect,vi,beforeEach} from "vitest";
const mock=vi.hoisted(()=>({actor:vi.fn(),writer:vi.fn()}));
vi.mock("@/core/auth/resolveCurrentActor",()=>({resolveCurrentActor:mock.actor}));
vi.mock("@/modules/audit/infrastructure/repo/SaasAuditWriter",()=>({recordSaasAudit:mock.writer}));
import {withAuditedMutation} from "@/modules/audit/infrastructure/http/withAuditedMutation";
describe("audited mutations across roles",()=>{beforeEach(()=>{vi.clearAllMocks();mock.writer.mockResolvedValue(undefined)});
it.each(["ADMIN","TENANT","TEACHER","STUDENT","PROCTOR"])("writes success for %s",async role=>{mock.actor.mockResolvedValue({userId:"actor1",username:"actor1",role,tenantId:role==="ADMIN"?null:"tenant1"});const wrapped=withAuditedMutation(async (_req:Request)=>Response.json({success:true}),"test.resource");await wrapped(new Request("https://test.invalid/api",{method:"POST"}));expect(mock.writer).toHaveBeenCalledWith(expect.objectContaining({actor:expect.objectContaining({role}),action:"test.resource.post"}))});
it("never records unsuccessful HTTP responses",async()=>{mock.actor.mockResolvedValue({userId:"a",role:"STUDENT",tenantId:"t"});const wrapped=withAuditedMutation(async()=>new Response(null,{status:403}),"test");await wrapped(new Request("https://test.invalid/api",{method:"POST"}));expect(mock.writer).not.toHaveBeenCalled()});
});
