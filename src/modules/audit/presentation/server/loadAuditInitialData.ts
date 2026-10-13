import "server-only";
import { getAuditUseCases } from "@/app/api/audit/_factory";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { parseAuditQuery } from "@/modules/audit/domain/builder/AuditQueryBuilder";
export async function loadAuditInitialData(
  actor: CurrentActor,
  searchParams: Record<string, string | string[] | undefined>,
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      for (const item of value) params.append(key, item);
    } else if (value !== undefined) {
      params.append(key, value);
    }
  }
  const query = parseAuditQuery(params);
  return { query, data: await getAuditUseCases().list.execute(actor, query) };
}
