import "server-only";
import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import { requireAuditCleanupAdmin } from "@/modules/audit/application/services/AuditRetentionService";
import { purgeExpiredAuditLogs } from "@/modules/audit/infrastructure/repo/AuditCleanupRepository";
const headers={"Cache-Control":"private, no-store","Vary":"Cookie, Authorization"};
export async function POST(req:Request):Promise<Response>{
 try{const actor=await resolveCurrentActor(req);requireAuditCleanupAdmin(actor);const result=await purgeExpiredAuditLogs();return Response.json(ApiResponse.success(result).body,{headers})}
 catch(e){const mapped=mapErrorToHttpResponse(e);return Response.json(mapped.body,{status:mapped.status,headers})}
}
