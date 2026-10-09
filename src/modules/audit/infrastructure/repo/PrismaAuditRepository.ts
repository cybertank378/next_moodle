import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/libs/prisma";
import type { AuditQuery } from "@/modules/audit/domain/builder/AuditQueryBuilder";
import type { AuditRepositoryInterface,AuditScope } from "@/modules/audit/domain/interfaces/AuditRepositoryInterface";
import type { AuditListResponseDTO,AuditDetailDTO } from "@/modules/audit/domain/dto/AuditResponseDTO";
import { sanitizeAuditMetadata } from "@/modules/audit/domain/mapper/AuditMetadataSanitizer";
const fields={id:true,tenantId:true,actorId:true,actorRole:true,action:true,resource:true,resourceId:true,ipAddress:true,createdAt:true,tenant:{select:{name:true,slug:true}}} satisfies Prisma.SaasAuditLogSelect;
function wibStart(day:string){return new Date(day+"T00:00:00+07:00")}
function nextDay(day:string){const d=wibStart(day);d.setUTCDate(d.getUTCDate()+1);return d}
function todayWib(now:Date){return new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Jakarta",year:"numeric",month:"2-digit",day:"2-digit"}).format(now)}
function whereFor(q:AuditQuery,s:AuditScope):Prisma.SaasAuditLogWhereInput {
 const tenantId=s.role==="TENANT"?s.tenantId:q.tenantId;
 return { ...(tenantId?{tenantId}:{}),...(q.actorRole?{actorRole:q.actorRole}:{}),...(q.action?{action:q.action}:{}),...(q.resource?{resource:q.resource}:{}),
 ...(q.from||q.to?{createdAt:{...(q.from?{gte:wibStart(q.from)}:{}),...(q.to?{lt:nextDay(q.to)}:{})}}:{}),
 ...(q.search?{OR:[{actorId:{contains:q.search,mode:"insensitive"}},{action:{contains:q.search,mode:"insensitive"}},{resource:{contains:q.search,mode:"insensitive"}},{resourceId:{contains:q.search,mode:"insensitive"}},{ipAddress:{contains:q.search,mode:"insensitive"}},{tenant:{is:{OR:[{name:{contains:q.search,mode:"insensitive"}},{slug:{contains:q.search,mode:"insensitive"}}]}}}]}:{})};
}
function map(row:{id:string;tenantId:string|null;actorId:string;actorRole:string;action:string;resource:string;resourceId:string|null;ipAddress:string|null;createdAt:Date;tenant:{name:string;slug:string}|null}){return {id:row.id,tenantId:row.tenantId,tenantName:row.tenant?.name??"Platform",tenantSlug:row.tenant?.slug??"platform",actorId:row.actorId,actorRole:row.actorRole,action:row.action,resource:row.resource,resourceId:row.resourceId,ipAddress:row.ipAddress,createdAt:row.createdAt.toISOString()}}
export class PrismaAuditRepository implements AuditRepositoryInterface {
 async list(q:AuditQuery,s:AuditScope):Promise<AuditListResponseDTO>{const where=whereFor(q,s);const now=new Date();const [rows,total,admin,tenant,today]=await Promise.all([
 prisma.saasAuditLog.findMany({where,select:fields,skip:(q.page-1)*q.pageSize,take:q.pageSize,orderBy:[{createdAt:q.sortOrder},{id:q.sortOrder}]}),
 prisma.saasAuditLog.count({where}),prisma.saasAuditLog.count({where:{AND:[where,{actorRole:"ADMIN"}]}}),
 prisma.saasAuditLog.count({where:{AND:[where,{actorRole:"TENANT"}]}}),
 prisma.saasAuditLog.count({where:{AND:[where,{createdAt:{gte:wibStart(todayWib(now)),lte:now}}]}})]);
 return {items:rows.map(map),total,page:q.page,pageSize:q.pageSize,totalPages:Math.ceil(total/q.pageSize),statistics:{total,admin,tenant,today},scope:s,fetchedAt:now.toISOString()}}
 async findById(id:string,s:AuditScope):Promise<AuditDetailDTO|null>{const row=await prisma.saasAuditLog.findFirst({where:{id,...(s.role==="TENANT"?{tenantId:s.tenantId??""}:{})},select:{...fields,details:true,userAgent:true}});return row?{...map(row),userAgent:row.userAgent,details:sanitizeAuditMetadata(row.details)}:null}
}
