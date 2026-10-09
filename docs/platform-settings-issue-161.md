# Issue #161 — Platform Settings

## Routes
- ADMIN: `GET /api/settings`, `PATCH /api/settings` with complete allowlisted fields plus `expectedRevision`.
- Dashboard: `/dashboard/settings` (ADMIN only).
- Manifest: `/manifest.webmanifest`; public metadata from the safe allowlisted projection.
- Login: support email and HTTPS URL (only when non-empty); application name footer.
- Tenant branding and credentials are unchanged.

## Data / defaults
Singleton `platform_settings` row ID `platform`; columns are strongly typed. SQL migration seeds the default **only when absent**, with name/short name `Aksaventra`, description as in `src/libs/branding.ts`, theme `#082d61`, background `#ffffff`, empty optional support contacts.

Deploy: back up PostgreSQL, run `npx prisma migrate deploy`, `npx prisma generate`, restart, then verify. No `migrate reset`.

## Consistency and security
PATCH validates every field, denies unknown keys and role mismatches, uses `updateMany` with revision predicate within a transaction. Audit insert in `saas_audit_logs` uses `tenantId: null` within the same transaction. Failed audit rolls back the settings update. No-op leaves revision intact and creates no audit event. A revision mismatch returns 409.

Only public fields are selected for root metadata and PWA manifest. Private updater identity does not leave the administrative API. All admin responses are no-store. Root metadata intentionally reads the small public projection from PostgreSQL instead of invoking internal auth APIs.

## Implementation caveats
- Existing browser-installed PWAs may keep the previous name/colors until the browser refreshes manifest metadata.
- Brand logo art remains unchanged even if the text name changes.
- Screenshots and DB integration tests must be captured in a running environment before release.
- Automatic end-to-end test execution is not available in this GitHub-only environment. CI must run `npm run typecheck`, `npm run lint`, `npm run lint:barrel`, `npm run test`, `npm run build`.
