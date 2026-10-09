export interface AuditListItemDTO {id:string;tenantId:string;tenantName:string;tenantSlug:string;actorId:string;actorRole:string;action:string;resource:string;resourceId:string|null;ipAddress:string|null;createdAt:string}
export interface AuditDetailDTO extends AuditListItemDTO {userAgent:string|null;details:Record<string,unknown>}
export interface AuditListResponseDTO {items:AuditListItemDTO[];total:number;page:number;pageSize:number;totalPages:number;statistics:{total:number;admin:number;tenant:number;today:number};scope:{role:"ADMIN"|"TENANT";tenantId:string|null};fetchedAt:string}
