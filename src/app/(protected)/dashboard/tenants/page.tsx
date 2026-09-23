import TenantsManagementView from "@/sections/tenants/organisms/TenantsManagementView";
import { requireTenantsAdmin } from "@/modules/tenants/presentation/server/requireTenantsAdmin";

export default async function TenantsPage() {
  await requireTenantsAdmin();
  return <TenantsManagementView />;
}
