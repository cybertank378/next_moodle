import { requireTenantAdmin } from "@/modules/tenant/presentation/server/requireTenantAdmin";
import TenantsManagementView from "@/sections/tenant/organisms/TenantsManagementView";

export default async function TenantsPage() {
  await requireTenantAdmin();
  return <TenantsManagementView />;
}
