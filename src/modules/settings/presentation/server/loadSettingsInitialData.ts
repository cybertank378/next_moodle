import "server-only";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { createSettingsUseCases } from "@/app/api/settings/_factory";

export async function loadSettingsInitialData(actor:CurrentActor | null) {
  return createSettingsUseCases().read.execute(actor);
}
