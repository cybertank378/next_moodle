"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AuditQuery } from "@/modules/audit/domain/builder/AuditQueryBuilder";
import type { AuditListResponseDTO } from "@/modules/audit/domain/dto/AuditResponseDTO";
import { useAuditApi } from "@/modules/audit/presentation/hooks/useAuditApi";
import { downloadAuditCsv } from "@/modules/audit/presentation/helpers/auditCsv";
import Button from "@/shared-ui/component/Button";
import Pagination from "@/shared-ui/component/Pagination";
import SelectField from "@/shared-ui/component/SelectField";
import { AuditFilterBar } from "@/sections/audit/molecules/AuditFilterBar";
import { AuditHistory } from "@/sections/audit/molecules/AuditHistory";
import { AuditDetailModal } from "@/sections/audit/molecules/AuditDetailModal";
function url(q:AuditQuery){const params=new URLSearchParams();for(const [k,v] of Object.entries(q))if(v!==undefined&&v!=="")params.set(k,String(v));return "/dashboard/audit?"+params.toString()}
export function AuditManagementView({initialData,initialQuery}:{initialData:AuditListResponseDTO;initialQuery:AuditQuery}){
 const router=useRouter();const api=useAuditApi(initialData,initialQuery);const [selected,setSelected]=useState<string|null>(null);const [notice,setNotice]=useState("");
 const apply=(q:AuditQuery)=>{router.replace(url(q),{scroll:false})};
 const stats=api.data.statistics;const stale=api.loading||!!api.error;
 return <main className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 sm:px-6">
 <header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold">Log Audit</h1><p className="text-sm text-slate-500">{api.data.scope.role==="ADMIN"?"Aktivitas platform dan tenant":"Aktivitas tenant Anda"}</p></div><div className="flex gap-2"><Button variant="outline" onClick={()=>void api.refresh()} loading={api.loading} className="min-h-11">Muat ulang</Button><Button disabled={stale||!api.data.items.length} onClick={()=>{downloadAuditCsv(api.data.items);setNotice("CSV halaman berhasil dibuat.")}} className="min-h-11">Ekspor Halaman CSV</Button></div></header>
 <section aria-label="Statistik audit" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[["Total aktivitas",stats.total],["Aktivitas ADMIN",stats.admin],["Aktivitas TENANT",stats.tenant],["Hari ini (WIB)",stats.today]].map(([label,value])=><div key={label} className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-semibold">{Number(value).toLocaleString("id-ID")}</p></div>)}</section>
 <AuditFilterBar query={initialQuery} isAdmin={api.data.scope.role==="ADMIN"} onApply={apply} onReset={()=>router.replace("/dashboard/audit",{scroll:false})}/>
 {api.error&&<div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4"><p>{api.error}</p><Button onClick={()=>void api.refresh()}>Coba lagi</Button></div>}
 {notice&&<p role="status" className="text-sm text-emerald-700">{notice}</p>}
 <section className="space-y-4"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-semibold">Riwayat aktivitas</h2><p className="text-sm text-slate-500">{api.data.total} hasil</p></div><div className="flex gap-3"><div className="w-36"><SelectField label="Ukuran halaman" value={initialQuery.pageSize} onChange={e=>apply({...initialQuery,page:1,pageSize:Number(e.target.value)})}><option value="10">10</option><option value="25">25</option><option value="50">50</option></SelectField></div><div className="w-40"><SelectField label="Urutan" value={initialQuery.sortOrder} onChange={e=>apply({...initialQuery,page:1,sortOrder:e.target.value as "asc"|"desc"})}><option value="desc">Terbaru</option><option value="asc">Terlama</option></SelectField></div></div></div>
 {!api.error&&<AuditHistory items={api.data.items} loading={api.loading} onDetail={id=>{setSelected(id);void api.loadDetail(id)}}/>}
 {!api.error&&!api.loading&&<Pagination currentPage={api.data.page} totalItems={api.data.total} itemsPerPage={api.data.pageSize} onPageChangeAction={page=>apply({...initialQuery,page})}/>}
 </section><AuditDetailModal open={selected!==null} detail={api.detail} loading={api.detailLoading} error={api.detailError} onClose={()=>{setSelected(null);api.closeDetail()}}/>
 </main>
}
