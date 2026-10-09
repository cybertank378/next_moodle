import type { AuditQuery } from "@/modules/audit/domain/builder/AuditQueryBuilder";
import type { AuditListResponseDTO } from "@/modules/audit/domain/dto/AuditResponseDTO";
import { AuditManagementView } from "@/sections/audit/organisms/AuditManagementView";
export default function AuditPageView({
  initialData,
  initialQuery,
  retention,
}: {
  initialData: AuditListResponseDTO;
  initialQuery: AuditQuery;
  retention?: { protectedCount: number; eligibleCount: number; cutoff: string };
}) {
  return (
    <AuditManagementView
      initialData={initialData}
      initialQuery={initialQuery}
      retention={retention}
    />
  );
}
