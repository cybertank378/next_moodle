# Audit actorName migration and deployment order

The audit UI displays the authenticated user's **name**, not the technical actor ID or role. New events write `actorName` to the `saas_audit_logs` table.

## Required deploy sequence

1. Ensure `DATABASE_URL` refers to the correct database. Back up before migrations.
2. Run `npx prisma migrate deploy` (production/staging) or `npx prisma migrate dev` (development), including migration `20261009063000_audit_actor_name`.
3. Run `npx prisma generate` to regenerate the Prisma Client. This is **required**: otherwise `saasAuditLog.create({data:{actorName:...}})` throws `Unknown argument actorName`.
4. Restart the Next.js server (and restart the dev server if running).
5. Run `npm run typecheck`, `npm run test`, `npm run lint`, and `npm run build`.

The login controller logs audit persistence failures to the server without converting successful Moodle login into HTTP 500. This is a temporary availability protection, **not guaranteed audit persistence**. Track log failures and implement a durable transactional outbox/queue before enforcing comprehensive audit guarantees.

Existing rows have `actorName = NULL` and show 'Nama pengguna tidak tersedia' until they can be resolved through an authoritative user directory. Never fabricate names or show the ID as a user-facing fallback.
