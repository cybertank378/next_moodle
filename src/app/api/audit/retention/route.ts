import "server-only";
import {resolveCurrentActor} from "@/core/auth/resolveCurrentActor";
import {ApiResponse} from "@/core/http/ApiResponse";
import {mapErrorToHttpResponse} from "@/core/http/mapErrorToHttpResponse";
import {requireAuditCleanupAdmin} from "@/modules/audit/application/services/AuditRetentionService";
import {getAuditRetentionOverview} from "@/modules/audit/infrastructure/repo/AuditRetentionOverview";
const headers={"Cache-Control":"private, no-store","Vary":"Cookie, Authorization"};
export async function GET(request:Request):Promise<Response>{try{const actor=await resolveCurrentActor(request);requireAuditCleanupAdmin(actor);return Response.json(ApiResponse.success(await getAuditRetentionOverview()).body,{headers})}catch(e){const r=mapErrorToHttpResponse(e);return Response.json(r.body,{status:r.status,headers})}}
