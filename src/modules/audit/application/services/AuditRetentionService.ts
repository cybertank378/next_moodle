import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { AppRole } from "@/core/rbac/AppRole";
import type { CurrentActor } from "@/core/auth/CurrentActor";
export function auditRetentionCutoff(now:Date):Date {const date=new Date(now);date.setUTCMonth(date.getUTCMonth()-3);return date}
export function requireAuditCleanupAdmin(actor:CurrentActor):void{if(actor.role!==AppRole.ADMIN)throw new AuthorizationError("Hanya ADMIN yang diizinkan membersihkan audit log.")}
