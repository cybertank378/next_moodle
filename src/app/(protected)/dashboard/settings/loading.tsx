export default function Loading(){
 return <main role="status" aria-label="Memuat pengaturan" className="mx-auto max-w-[1600px] space-y-4 p-6">
  <div className="h-12 w-72 animate-pulse rounded-xl bg-slate-200"/>
  <div className="h-12 animate-pulse rounded-xl bg-slate-100"/>
  <div className="grid gap-5 lg:grid-cols-3"><div className="h-80 animate-pulse rounded-xl bg-slate-100 lg:col-span-2"/><div className="h-64 animate-pulse rounded-xl bg-slate-100"/></div>
 </main>;
}
