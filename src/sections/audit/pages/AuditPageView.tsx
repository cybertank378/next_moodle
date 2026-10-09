import type { AuditQuery } from "@/modules/audit/domain/builder/AuditQueryBuilder";
import type { AuditListResponseDTO } from "@/modules/audit/domain/dto/AuditResponseDTO";
import { AuditManagementView } from "@/sections/audit/organisms/AuditManagementView";
export default function AuditPageView({initialData,initialQuery}:{initialData:AuditListResponseDTO;initialQuery:AuditQuery}){return <AuditManagementView initialData={initialData} initialQuery={initialQuery}/>}
