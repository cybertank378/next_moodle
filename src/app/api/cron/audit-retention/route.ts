import { recordSaasAudit } from "@/modules/audit/infrastructure/repo/SaasAuditWriter";
import "server-only";
import { purgeExpiredAuditLogs } from "@/modules/audit/infrastructure/repo/AuditCleanupRepository";
export async function POST(req:Request):Promise<Response>{
 const secret=process.env.AUDIT_RETENTION_CRON_SECRET;
 const authorized=Boolean(secret&&req.headers.get("authorization")===`Bearer ${secret}`);
 if(!authorized)return Response.json({success:false,error:{code:"UNAUTHORIZED",message:"Cron authorization required."}},{status:401,headers:{"Cache-Control":"no-store"}});
 const result=await purgeExpiredAuditLogs();
 await recordSaasAudit({actor:{userId:"system:audit-retention",username:"system:audit-retention",role:"SYSTEM",tenantId:null},tenantId:null,action:"audit.cleanup.automatic",resource:"saas_audit_logs",details:{event:"audit.cleanup",recordCount:result.deleted}});
 return Response.json({success:true,data:result},{headers:{"Cache-Control":"no-store"}});
}
