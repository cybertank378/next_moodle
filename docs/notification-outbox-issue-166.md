# Notification delivery — Issue #166
The ADMIN Send action queues a job instead of issuing mass Moodle requests inline.

## Deployment
1. Apply migrations: `npx prisma migrate deploy`, then `npx prisma generate`. **Back up PostgreSQL first. No reset.**
2. Configure a strong `NOTIFICATION_OUTBOX_CRON_SECRET` in the server environment (never NEXT_PUBLIC).
3. Schedule an authenticated server-to-server POST to `/api/cron/notification-outbox` with `Authorization: Bearer <secret>` every minute. The endpoint processes up to five jobs per invocation. Each invocation returns process counts.
4. Verify tenant admin Moodle tokens can call `core_course_get_courses` and `core_enrol_get_enrolled_users`. These functions are already referenced by the course/enrolment repositories. Course enrolment role shortnames must match actual configured Moodle roles.
5. Log in as a STUDENT of an active tenant; create a campaign addressed to that tenant's students; verify the inbox and delivery rows. Test with a STUDENT of another tenant.
6. The dashboard shows QUEUED until the worker processes the job. IN_APP does not depend on Firebase.

## Incomplete work / rollout restrictions
- Course traversal is synchronous and not yet checkpointed by tenant. Large Moodle installations need cursor-based fan-out to bounded jobs.
- A failure in a Moodle request fails the overall attempt and retries the whole job. No per-tenant partial dispatch status/report yet.
- PUSH side effects are not exactly once on crashes. This requires device-level attempt tracking and reconciliation.
- Existing Moodle auth role mapping may differ from enrolment roles for dual-role accounts. Validate on real sites.
- Verify migration and all tests before merging. The PR remains Draft.
