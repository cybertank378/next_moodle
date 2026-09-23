import { requireTenantsAdmin } from "@/modules/tenants/presentation/server/requireTenantsAdmin";
import TenantCreateView from "@/sections/tenants/organisms/TenantCreateView";

export default async function CreateTenantPage() {
  await requireTenantsAdmin();
  return <TenantCreateView />;
}
