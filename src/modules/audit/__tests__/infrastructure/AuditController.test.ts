import {beforeEach,describe,expect,it,vi} from "vitest";
import {UnauthorizedError} from "@/core/errors/UnauthorizedError";
import {AuthorizationError} from "@/core/rbac/AuthorizationError";
const mock=vi.hoisted(()=>({resolve:vi.fn()}));
vi.mock("@/core/auth/resolveCurrentActor",()=>({resolveCurrentActor:mock.resolve}));
import {AuditController} from "@/modules/audit/infrastructure/http/AuditController";
const req=(url:string)=>new Request("https://example.test"+url);
function setup(){const list={execute:vi.fn().mockResolvedValue({items:[],total:0,page:1,pageSize:10,totalPages:0,statistics:{total:0,admin:0,tenant:0,today:0},scope:{role:"ADMIN",tenantId:null},fetchedAt:"2026-10-09T00:00:00.000Z"})};const detail={execute:vi.fn().mockResolvedValue(null)};return {controller:new AuditController(list as never,detail as never),list,detail}}
describe("Audit API HTTP",()=>{beforeEach(()=>{vi.resetAllMocks();mock.resolve.mockResolvedValue({userId:"a",username:"a",role:"ADMIN",tenantId:null})});
it("200 private no-store",async()=>{const r=await setup().controller.list(req("/api/audit"));expect(r.status).toBe(200);expect(r.headers.get("cache-control")).toBe("private, no-store");expect(r.headers.get("vary")).toBe("Cookie, Authorization")});
it("400 query validation",async()=>{const r=await setup().controller.list(req("/api/audit?pageSize=101"));expect(r.status).toBe(400);expect((await r.json()).error.code).toBe("VALIDATION_ERROR")});
it("401 missing session",async()=>{mock.resolve.mockRejectedValue(new UnauthorizedError());expect((await setup().controller.list(req("/api/audit"))).status).toBe(401)});
it("403 denied access",async()=>{const s=setup();s.list.execute.mockRejectedValue(new AuthorizationError());expect((await s.controller.list(req("/api/audit"))).status).toBe(403)});
it("404 hidden details",async()=>{expect((await setup().controller.detail(req("/api/audit/log-other"),"log-other")).status).toBe(404)});
it("400 malformed details ID",async()=>{expect((await setup().controller.detail(req("/api/audit/invalid.id"),"invalid.id")).status).toBe(400)});
it("error responses are private",async()=>{const r=await setup().controller.list(req("/api/audit?invalid=1"));expect(r.headers.get("cache-control")).toBe("private, no-store")})});
