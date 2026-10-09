import {requireDashboardRoles} from "@/modules/auth/server/requireDashboardRoles";
import {getAuditRetentionOverview} from "@/modules/audit/infrastructure/repo/AuditRetentionOverview";
import {AuditRetentionView} from "@/sections/audit/organisms/AuditRetentionView";
export default async function AuditRetentionPage(){await requireDashboardRoles(["ADMIN"]);const initial=await getAuditRetentionOverview();return <AuditRetentionView initial={initial}/>}
