import { requireTenantAdmin } from "@/modules/tenant/presentation/server/requireTenantAdmin";
import TenantsManagementView from "@/sections/tenants/organisms/TenantsManagementView";

export default async function TenantsPage() {
  await requireTenantAdmin();
  return <TenantsManagementView />;
}
