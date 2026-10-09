import "server-only";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { prisma } from "@/libs/prisma";
import { sanitizeAuditMetadata } from "@/modules/audit/domain/mapper/AuditMetadataSanitizer";
export interface SaasAuditEvent { actor:CurrentActor; tenantId:string|null;action:string;resource:string;resourceId?:string|null;details?:unknown;ipAddress?:string|null;userAgent?:string|null }
export async function recordSaasAudit(event:SaasAuditEvent):Promise<void>{
 if(!event.actor.userId)throw new Error("Audit event requires verified actor and tenant.");
 await prisma.saasAuditLog.create({data:{tenantId:event.tenantId,actorId:event.actor.userId,actorName:((event.actor.displayName?.trim()||event.actor.username?.trim())&&!/^moodle:[^:]+:\d+$/.test(event.actor.displayName?.trim()||event.actor.username?.trim()||""))?(event.actor.displayName?.trim()||event.actor.username?.trim()).slice(0,255):null,actorRole:String(event.actor.role),action:event.action,resource:event.resource,resourceId:event.resourceId??null,details:sanitizeAuditMetadata(event.details),ipAddress:event.ipAddress??null,userAgent:event.userAgent??null}});
}
