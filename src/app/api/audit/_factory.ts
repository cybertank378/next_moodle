import "server-only";
import { GetAuditDetailUseCase } from "@/modules/audit/application/usecases/GetAuditDetailUseCase";
import { GetAuditListUseCase } from "@/modules/audit/application/usecases/GetAuditListUseCase";
import { AuditController } from "@/modules/audit/infrastructure/http/AuditController";
import { PrismaAuditRepository } from "@/modules/audit/infrastructure/repo/PrismaAuditRepository";

const repo = new PrismaAuditRepository();
const list = new GetAuditListUseCase(repo);
const detail = new GetAuditDetailUseCase(repo);
const controller = new AuditController(list, detail);
export function getAuditController() {
  return controller;
}
export function getAuditUseCases() {
  return { list, detail };
}
