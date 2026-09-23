import { requireTenantsAdmin } from "@/modules/tenants/presentation/server/requireTenantsAdmin";
import TenantDetailView from "@/sections/tenants/organisms/TenantDetailView";

export default async function TenantDetailPage() {
  await requireTenantsAdmin();
  return <TenantDetailView />;
}
