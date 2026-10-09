"use client";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {Download,RefreshCw,ShieldCheck} from "lucide-react";
import type {AuditQuery} from "@/modules/audit/domain/builder/AuditQueryBuilder";
import type {AuditListResponseDTO} from "@/modules/audit/domain/dto/AuditResponseDTO";
import {useAuditApi} from "@/modules/audit/presentation/hooks/useAuditApi";
import {downloadAuditCsv} from "@/modules/audit/presentation/helpers/auditCsv";
import Button from "@/shared-ui/component/Button";
import Pagination from "@/shared-ui/component/Pagination";
import {AuditFilterBar} from "@/sections/audit/molecules/AuditFilterBar";
import {AuditHistory} from "@/sections/audit/molecules/AuditHistory";
import {AuditDetailModal} from "@/sections/audit/molecules/AuditDetailModal";
import {AuditStatistics} from "@/sections/audit/molecules/AuditStatistics";
import {AuditRetentionBanner} from "@/sections/audit/molecules/AuditRetentionBanner";
type Overview={protectedCount:number;eligibleCount:number;cutoff:string};
function url(q:AuditQuery){const params=new URLSearchParams();for(const [key,value] of Object.entries(q))if(value!==undefined&&value!=="")params.set(key,String(value));return "/dashboard/audit?"+params.toString()}
export function AuditManagementView({initialData,initialQuery,retention}:{initialData:AuditListResponseDTO;initialQuery:AuditQuery;retention?:Overview}){
 const router=useRouter();const api=useAuditApi(initialData,initialQuery);const [selected,setSelected]=useState<string|null>(null);const [notice,setNotice]=useState("");
 const isAdmin=api.data.scope.role==="ADMIN";
 const apply=(q:AuditQuery)=>router.replace(url(q),{scroll:false});
 return <main className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 sm:px-6">
 <header className="flex flex-wrap items-center justify-between gap-4"><div><p className="mb-2 text-xs font-semibold text-indigo-600">Dashboard / Keamanan / Log Audit</p><h1 className="text-3xl font-bold tracking-tight text-slate-900">Log Audit</h1><p className="mt-1 text-sm text-slate-500">Pantau aktivitas pengguna, keamanan, dan perubahan data {isAdmin?"di semua tenant.":"tenant Anda."}</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" color="secondary" leftIcon={RefreshCw} loading={api.loading} onClick={()=>void api.refresh()} className="min-h-11">Muat Ulang</Button><Button leftIcon={Download} disabled={api.loading||!!api.error||!api.data.items.length} onClick={()=>{downloadAuditCsv(api.data.items);setNotice("CSV halaman berhasil dibuat.")}} className="min-h-11">Ekspor CSV</Button></div></header>
 <AuditStatistics total={api.data.statistics.total} today={api.data.statistics.today} protectedCount={retention?.protectedCount} eligibleCount={retention?.eligibleCount} isAdmin={isAdmin}/>
 <AuditRetentionBanner isAdmin={isAdmin}/>
 <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-semibold text-slate-900">Riwayat Aktivitas</h2><p className="text-xs text-slate-500">{api.data.total.toLocaleString("id-ID")} hasil dari database</p></div><span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"><ShieldCheck size={14}/> Audit Aktif</span></div>
 <AuditFilterBar query={initialQuery} isAdmin={isAdmin} onApply={apply} onReset={()=>router.replace("/dashboard/audit",{scroll:false})}/>
 {api.error&&<div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{api.error}<Button variant="outline" color="error" onClick={()=>void api.refresh()}>Coba lagi</Button></div>}
 {notice&&<p role="status" className="text-sm text-emerald-700">{notice}</p>}
 {!api.error&&<AuditHistory items={api.data.items} loading={api.loading} retentionCutoff={retention?.cutoff} onDetail={id=>{setSelected(id);void api.loadDetail(id)}}/>}
 {!api.error&&!api.loading&&<Pagination currentPage={api.data.page} totalItems={api.data.total} itemsPerPage={api.data.pageSize} onPageChangeAction={page=>apply({...initialQuery,page})}/>}
 </section>
 <AuditDetailModal open={selected!==null} detail={api.detail} loading={api.detailLoading} error={api.detailError} retentionCutoff={retention?.cutoff} onClose={()=>{setSelected(null);api.closeDetail()}}/>
 </main>
}
