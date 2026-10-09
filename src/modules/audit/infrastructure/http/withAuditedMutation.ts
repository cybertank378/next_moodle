import "server-only";
import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";
import { recordSaasAudit } from "@/modules/audit/infrastructure/repo/SaasAuditWriter";
// biome-ignore lint/suspicious/noExplicitAny: Preserve heterogeneous route handler signatures.
export function withAuditedMutation<T extends (...args: any[]) => Promise<Response>>(handler:T,resource:string):T{
 const wrapped=async (...args:Parameters<T>)=>{
  const request=args[0] as Request;
  const actor=await resolveCurrentActor(request).catch(()=>null);
  const response=await handler(...args);
  if(response.ok&&actor)await recordSaasAudit({actor,tenantId:actor.tenantId??null,action:resource+"."+request.method.toLowerCase(),resource,details:{event:"http.mutation",operation:request.method}});
  return response;
 };
 return wrapped as T;
}
