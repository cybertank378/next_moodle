export function SettingsColorPreview({label,color}:{label:string;color:string}){
  return <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
    <span className="h-10 w-10 shrink-0 rounded-lg border border-slate-200" style={{backgroundColor:/^#[a-fA-F0-9]{6}$/.test(color)?color:"#ffffff"}} aria-hidden="true"/>
    <div><p className="text-xs text-slate-500">{label}</p><p className="font-mono text-sm font-semibold">{color}</p></div>
  </div>;
}
