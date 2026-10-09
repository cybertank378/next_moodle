import {describe,it,expect} from "vitest";
import {createAuditCsv} from "@/modules/audit/presentation/helpers/auditCsv";
describe("audit actor display",()=>{it("exports actor name instead of technical actor id",()=>{const csv=createAuditCsv([{id:"1",tenantId:"t",tenantName:"Sekolah",tenantSlug:"test",actorId:"moodle:t:7",actorName:"Nadia Putri",actorRole:"STUDENT",action:"auth.login",resource:"session",resourceId:null,ipAddress:null,createdAt:"2026-10-09T04:52:48.132Z"}]);expect(csv).toContain("Nadia Putri");expect(csv).not.toContain("moodle:t:7");expect(csv).not.toContain("STUDENT")})});
