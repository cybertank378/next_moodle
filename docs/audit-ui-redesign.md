# UI audit dashboard — reference PNG
- Enterprise slate/indigo surface, responsive audit table with role-free actor display and detail modal.
- User-facing name is `actorName` stored at event time from authenticated actor displayName or username; never render `actorId`.
- Historical records written before actorName migration do not have names. Show "Nama pengguna tidak tersedia" instead of guessing a name or displaying a role.
- CSV excludes actor ID and role; only name is shown.
- Admin-only retention page and deletion confirmation use real PostgreSQL aggregate and cleanup API.
- Apply `prisma/migrations/20261009063000_audit_actor_name` before deploying updated Prisma writer.
