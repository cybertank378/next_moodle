"use client";
import Button from "@/shared-ui/component/Button";
const tabs=["Umum","Dukungan","PWA","Informasi Sistem"] as const;
export type SettingsTab=(typeof tabs)[number];
export function SettingsNavigation({active,onChange}:{active:SettingsTab;onChange:(tab:SettingsTab)=>void}){
  return <nav aria-label="Bagian pengaturan" className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1 md:grid-cols-4">
    {tabs.map(tab=><Button key={tab} type="button" variant="ghost" color="secondary" aria-current={active===tab?"page":undefined}
      onClick={()=>onChange(tab)} className={`min-h-11 rounded-lg px-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-indigo-500 ${active===tab?"bg-white text-indigo-700 shadow-sm":"text-slate-600 hover:bg-white/70"}`}>{tab}</Button>)}
  </nav>;
}
