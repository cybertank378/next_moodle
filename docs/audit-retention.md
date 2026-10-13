# SaaS Audit Retention
- Table: public.saas_audit_logs.
- All roles may produce audit events; only ADMIN can manually trigger retention cleanup. No per-row deletion endpoint.
- PostgreSQL BEFORE DELETE/UPDATE trigger protects records within 3 calendar months and prevents modifications.
- ON DELETE RESTRICT protects tenant audit history against cascading tenant removal. Hard deleting a tenant with audit history will fail. Prefer soft-deactivation.
- POST /api/audit/cleanup requires authenticated ADMIN.
- POST /api/cron/audit-retention requires AUDIT_RETENTION_CRON_SECRET via Bearer token. Configure external scheduler to call daily; route existence alone does not schedule it.
- Cleanup is incremental (500 rows per call). Schedule repeated calls for backlog or implement bounded multi-batch worker.
- Age comparison uses database NOW() - interval '3 months'; application cutoff is indicative and must never loosen DB policy.
- Full event coverage across Moodle operations needs producer integration and delivery-failure/retry strategies. Moodle persistence must be assessed separately.
