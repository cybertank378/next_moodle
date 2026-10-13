# Issue #159: SaaS Audit Dashboard
- This module reads PostgreSQL SaasAuditLog, not Moodle local_examapi logs.
- Tenant isolation is enforced in the application service and Prisma WHERE for list, detail and statistics.
- Only explicitly allowlisted details fields are returned; raw credentials, headers and payloads are omitted.
- Server loader shares use cases with HTTP handlers. URL search params are authoritative; changing filters uses App Router replace.
- CSV exports only current page; empty persisted data yields empty state, never mock records.
- Remaining release gate: run npm run typecheck, npm run lint, npm run lint:barrel, npm run test, npm run build and inspect deployment database producers and browser accessibility.
