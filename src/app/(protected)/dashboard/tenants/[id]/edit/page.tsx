import { requireTenantsAdmin } from "@/modules/tenants/presentation/server/requireTenantsAdmin";
import TenantEditView from "@/sections/tenants/organisms/TenantEditView";

export default async function TenantEditPage() {
  await requireTenantsAdmin();
  return <TenantEditView />;
}
