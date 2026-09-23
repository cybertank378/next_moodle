-- Issue 41 — tenant metadata management indexes
CREATE INDEX "tenants_status_idx" ON "tenants"("status");
CREATE INDEX "tenants_name_idx" ON "tenants"("name");
