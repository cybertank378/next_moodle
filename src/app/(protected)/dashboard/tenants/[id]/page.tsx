import { requireTenantAdmin } from "@/modules/tenant/presentation/server/requireTenantAdmin";
import TenantDetailView from "@/sections/tenant/organisms/TenantDetailView";

export default async function TenantDetailPage() {
  await requireTenantAdmin();
  return <TenantDetailView />;
}
