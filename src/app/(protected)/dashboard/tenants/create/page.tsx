import { requireTenantAdmin } from "@/modules/tenant/presentation/server/requireTenantAdmin";
import TenantCreateView from "@/sections/tenant/organisms/TenantCreateView";

export default async function CreateTenantPage() {
  await requireTenantAdmin();
  return <TenantCreateView />;
}
