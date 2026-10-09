import { requireTenantAdmin } from "@/modules/tenant/presentation/server/requireTenantAdmin";
import TenantEditView from "@/sections/tenant/organisms/TenantEditView";

export default async function TenantEditPage() {
  await requireTenantAdmin();
  return <TenantEditView />;
}
