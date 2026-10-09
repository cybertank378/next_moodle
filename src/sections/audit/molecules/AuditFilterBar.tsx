"use client";
import { useEffect,useState,type FormEvent } from "react";
import type { AuditQuery } from "@/modules/audit/domain/builder/AuditQueryBuilder";
import TextField from "@/shared-ui/component/TextField";
import SelectField from "@/shared-ui/component/SelectField";
import Button from "@/shared-ui/component/Button";
export function AuditFilterBar({query,isAdmin,onApply,onReset}:{query:AuditQuery;isAdmin:boolean;onApply:(q:AuditQuery)=>void;onReset:()=>void}){
 const [draft,setDraft]=useState(query);useEffect(()=>setDraft(query),[query]);
 const set=(key:keyof AuditQuery,value:string)=>setDraft(prev=>({...prev,[key]:value.trim()||undefined}));
 const submit=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();onApply({...draft,page:1,tenantId:isAdmin?draft.tenantId:undefined})};
 return <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-5"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
 <TextField label="Cari aktivitas" value={draft.search??""} onChange={e=>set("search",e.target.value)} maxLength={150}/>
 <SelectField label="Role aktor" value={draft.actorRole??""} onChange={e=>set("actorRole",e.target.value)}><option value="">Semua</option><option value="ADMIN">ADMIN</option><option value="TENANT">TENANT</option><option value="TEACHER">TEACHER</option><option value="STUDENT">STUDENT</option></SelectField>
 <TextField label="Dari (WIB)" type="date" value={draft.from??""} onChange={e=>set("from",e.target.value)}/>
 <TextField label="Sampai (WIB)" type="date" value={draft.to??""} onChange={e=>set("to",e.target.value)}/>
 <TextField label="Aksi" value={draft.action??""} onChange={e=>set("action",e.target.value)}/>
 <TextField label="Resource" value={draft.resource??""} onChange={e=>set("resource",e.target.value)}/>
 {isAdmin&&<TextField label="Tenant ID" value={draft.tenantId??""} onChange={e=>set("tenantId",e.target.value)}/>}
 </div><div className="mt-5 flex justify-end gap-3"><Button variant="outline" color="secondary" onClick={onReset} className="min-h-11">Reset</Button><Button type="submit" className="min-h-11">Terapkan</Button></div></form>
}
