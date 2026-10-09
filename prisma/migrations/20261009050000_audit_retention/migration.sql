-- Keep existing audit records from being removed when a tenant is hard-deleted.
ALTER TABLE "saas_audit_logs" DROP CONSTRAINT IF EXISTS "saas_audit_logs_tenantId_fkey";
ALTER TABLE "saas_audit_logs" ADD CONSTRAINT "saas_audit_logs_tenantId_fkey"
  FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- Database guard: calendar months in UTC; policy is minimum three complete months.
CREATE OR REPLACE FUNCTION enforce_saas_audit_retention()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'SaaS audit logs are immutable';
  END IF;
  IF OLD."createdAt" > (NOW() - INTERVAL '3 months') THEN
    RAISE EXCEPTION 'SaaS audit log retention: minimum 3 calendar months';
  END IF;
  RETURN OLD;
END;
$$;
DROP TRIGGER IF EXISTS saas_audit_retention_guard ON "saas_audit_logs";
CREATE TRIGGER saas_audit_retention_guard BEFORE UPDATE OR DELETE ON "saas_audit_logs"
FOR EACH ROW EXECUTE FUNCTION enforce_saas_audit_retention();
