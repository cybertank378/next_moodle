import type { AuditQuery } from "@/modules/audit/domain/builder/AuditQueryBuilder";
import type { AuditDetailDTO,AuditListResponseDTO } from "@/modules/audit/domain/dto/AuditResponseDTO";
export interface AuditScope {role:"ADMIN"|"TENANT";tenantId:string|null}
export interface AuditRepositoryInterface {list(query:AuditQuery,scope:AuditScope):Promise<AuditListResponseDTO>;findById(id:string,scope:AuditScope):Promise<AuditDetailDTO|null>}
