"use client";

import {useMemo,useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {Save,Undo2,RefreshCw,ShieldCheck} from "lucide-react";
import type {PlatformSettingsDTO,PlatformSettingsFields} from "@/modules/settings/domain/dto/PlatformSettingsDTO";
import {useSettingsApi} from "@/modules/settings/presentation/hooks/useSettingsApi";
import {validatePlatformSettingsUpdate} from "@/modules/settings/domain/validators/validatePlatformSettings";
import {SettingsColorPreview} from "@/sections/settings/atoms/SettingsColorPreview";
import {SettingsNavigation,type SettingsTab} from "@/sections/settings/molecules/SettingsNavigation";
import Button from "@/shared-ui/component/Button";
import TextField from "@/shared-ui/component/TextField";
import TextAreaField from "@/shared-ui/component/TextAreaField";
import {showErrorToast,showSuccessToast} from "@/shared-ui/component/Toast";
import {getBrandAsset} from "@/libs/branding";

const keys=["applicationName","applicationShortName","applicationDescription","supportEmail","supportUrl","pwaThemeColor","pwaBackgroundColor"] as const;
function draftFrom(dto:PlatformSettingsDTO):PlatformSettingsFields{
  return {applicationName:dto.applicationName,applicationShortName:dto.applicationShortName,
    applicationDescription:dto.applicationDescription,supportEmail:dto.supportEmail,
    supportUrl:dto.supportUrl,pwaThemeColor:dto.pwaThemeColor,pwaBackgroundColor:dto.pwaBackgroundColor};
}
export function SettingsManagementView({initial}:{initial:PlatformSettingsDTO}){
  const router=useRouter();
  const api=useSettingsApi(initial);
  const [draft,setDraft]=useState<PlatformSettingsFields>(()=>draftFrom(initial));
  const [tab,setTab]=useState<SettingsTab>("Umum");
  const dirty=keys.some(key=>draft[key]!==api.snapshot[key]);
  const validation=useMemo(()=>{
    try{validatePlatformSettingsUpdate({...draft,expectedRevision:api.snapshot.revision});return null}
    catch(error){return error instanceof Error?error.message:"Periksa kembali input."}
  },[draft,api.snapshot.revision]);
  const update = <K extends keyof PlatformSettingsFields,>(key: K, value: PlatformSettingsFields[K]) =>
    setDraft(previous=>({...previous,[key]:value}));
  const reload=async()=>{try{const result=await api.refresh();setDraft(draftFrom(result))}catch{showErrorToast("Gagal memuat pengaturan terbaru.")}};
  const submit=async()=>{
    if(api.saving||validation||!dirty)return;
    try{
      const result=await api.save({...draft,expectedRevision:api.snapshot.revision});
      setDraft(draftFrom(result));
      showSuccessToast("Pengaturan platform berhasil disimpan.");
      router.refresh();
    }catch{showErrorToast("Gagal menyimpan perubahan. Periksa pesan dan coba lagi.")}
  };
  return <main className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-6 sm:px-6">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-semibold text-indigo-600">Dashboard / Administrator / Settings</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Pengaturan Platform</h1>
        <p className="mt-1 text-sm text-slate-500">Kelola identitas, dukungan, dan pengalaman instalasi Aksaventra.</p></div>
      <div className="text-sm text-slate-500">Terakhir disimpan: {api.snapshot.updatedAt.startsWith("1970")?"Belum diinisialisasi":new Intl.DateTimeFormat("id-ID",{dateStyle:"medium",timeStyle:"short",timeZone:"Asia/Jakarta"}).format(new Date(api.snapshot.updatedAt))}</div>
    </header>
    <SettingsNavigation active={tab} onChange={setTab}/>
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(280px,1fr)]">
      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {tab==="Umum"&&<div className="space-y-4"><h2 className="text-lg font-semibold">Identitas aplikasi</h2>
          <TextField label="Nama aplikasi" value={draft.applicationName} onChange={e=>update("applicationName",e.target.value)} helperText="Nama yang muncul pada judul browser dan PWA."/>
          <TextField label="Nama singkat" maxLength={30} value={draft.applicationShortName} onChange={e=>update("applicationShortName",e.target.value)} helperText="Maksimal 30 karakter untuk manifest PWA."/>
          <TextAreaField label="Deskripsi aplikasi" value={draft.applicationDescription} onChange={e=>update("applicationDescription",e.target.value)} maxLength={500} helperText="Maksimal 500 karakter untuk metadata dan PWA."/></div>}
        {tab==="Dukungan"&&<div className="space-y-4"><h2 className="text-lg font-semibold">Kontak dukungan</h2>
          <TextField label="Email dukungan (opsional)" type="email" value={draft.supportEmail??""} onChange={e=>update("supportEmail",e.target.value||null)} placeholder="support@sekolah.id"/>
          <TextField label="URL bantuan HTTPS (opsional)" type="url" value={draft.supportUrl??""} onChange={e=>update("supportUrl",e.target.value||null)} placeholder="https://example.org/help"/></div>}
        {tab==="PWA"&&<div className="space-y-4"><h2 className="text-lg font-semibold">Tampilan Progressive Web App</h2>
          <TextField label="Warna tema (#RRGGBB)" value={draft.pwaThemeColor} onChange={e=>update("pwaThemeColor",e.target.value)} maxLength={7}/>
          <SettingsColorPreview label="Preview warna tema" color={draft.pwaThemeColor}/>
          <TextField label="Warna latar (#RRGGBB)" value={draft.pwaBackgroundColor} onChange={e=>update("pwaBackgroundColor",e.target.value)} maxLength={7}/>
          <SettingsColorPreview label="Preview warna latar" color={draft.pwaBackgroundColor}/></div>}
        {tab==="Informasi Sistem"&&<div className="space-y-3"><h2 className="text-lg font-semibold">Informasi konfigurasi</h2>
          <p className="text-sm">Versi aplikasi: <strong>0.1.0</strong></p><p className="text-sm">Bahasa: <strong>Indonesia</strong></p>
          <p className="text-sm">Revisi: <strong>{api.snapshot.revision}</strong></p><p className="text-sm">Pengaturan tersimpan di database platform.</p></div>}
        {dirty&&<p role="status" className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">Ada perubahan yang belum disimpan.</p>}
        {validation&&<p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{validation}</p>}
        {api.error&&<p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{api.error}</p>}
        {api.conflict&&<Button variant="outline" onClick={()=>void reload()} leftIcon={RefreshCw}>Muat versi terbaru</Button>}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <Button type="button" variant="outline" color="secondary" leftIcon={Undo2} disabled={!dirty||api.saving} onClick={()=>setDraft(draftFrom(api.snapshot))}>Batalkan perubahan</Button>
          <Button type="button" leftIcon={Save} loading={api.saving} disabled={!dirty||!!validation||api.saving||api.conflict} onClick={()=>void submit()}>Simpan perubahan</Button>
        </div>
      </div>
      <aside className="space-y-4"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Pratinjau identitas</h2>
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
          <Image src={getBrandAsset({surfaceTone:"light",variant:"mark"})} alt="Logo Aksaventra" width={48} height={48} className="h-12 w-12 object-contain"/>
          <div><p className="font-bold text-slate-900">{draft.applicationName||"Nama aplikasi"}</p><p className="text-xs text-slate-500">{draft.applicationShortName}</p></div>
        </div>
        <p className="mt-4 text-xs text-slate-500">{draft.applicationDescription}</p>
      </div><div className="flex gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-5"><ShieldCheck className="shrink-0 text-indigo-600"/><div><h3 className="font-semibold text-indigo-950">Khusus administrator platform</h3><p className="mt-1 text-sm text-indigo-800">Pengaturan ini tidak mengubah branding tenant maupun kredensial Moodle.</p></div></div></aside>
    </section>
  </main>;
}
