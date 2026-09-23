import { requireTenantsAdmin } from "@/modules/tenants/presentation/server/requireTenantsAdmin";
import TenantsManagementView from "@/sections/tenants/organisms/TenantsManagementView";

export default async function TenantsPage() {
  await requireTenantsAdmin();
  return <TenantsManagementView />;
}
