import {describe,it,expect} from "vitest";
import {parseAuditQuery} from "@/modules/audit/domain/builder/AuditQueryBuilder";
describe("audit query",()=>{it("defaults",()=>{expect(parseAuditQuery(new URLSearchParams())).toMatchObject({page:1,pageSize:10,sortOrder:"desc"})});it.each(["page=-1","pageSize=101","from=2026-02-30","from=2026-10-10&to=2026-10-01","page=1&page=2","unexpected=x"])("rejects %s",s=>{expect(()=>parseAuditQuery(new URLSearchParams(s))).toThrow()})});
