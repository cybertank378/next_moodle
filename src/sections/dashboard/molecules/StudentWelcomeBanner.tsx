import Typography from "@/shared-ui/component/Typography";
import { Flame } from "lucide-react";
import type { StudentProfileDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";
import Image from "next/image";

interface Props {
  profile?: StudentProfileDto;
}

export function StudentWelcomeBanner({ profile }: Props) {
  const illustration = profile?.gender === "perempuan" 
    ? "/assets/images/ilustrator/siswi-non-hijab.png" 
    : "/assets/images/ilustrator/siswa.png";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#f0f7ff] border border-blue-100 p-8 flex flex-col md:flex-row items-center justify-between shadow-sm">
      <div className="flex items-center">
         <div className="w-24 h-24 mr-6 hidden sm:flex items-center justify-center shrink-0">
            <div className="relative w-full h-full bg-blue-100 rounded-full flex items-center justify-center border-[6px] border-white shadow-sm overflow-hidden">
               <Image 
                 src={illustration} 
                 alt="Student Illustration" 
                 fill
                 className="object-cover"
               />
            </div>
         </div>
         <div>
            <Typography variant="h2" className="text-slate-800 font-bold mb-1 flex items-center gap-2">
              Halo, {profile?.name || "Andi Pratama"}! <span className="text-2xl">👋</span>
            </Typography>
            <Typography variant="body" className="text-slate-600 mb-4 font-medium">
              Terus semangat belajar dan raih cita-citamu!
            </Typography>
            <div className="flex items-center text-sm font-semibold text-slate-500 space-x-2">
               <span className="bg-white px-3 py-1 rounded-full border border-slate-200">{profile?.schoolName || "SMP Negeri 1 Jakarta"}</span>
               <span>•</span>
               <span className="bg-white px-3 py-1 rounded-full border border-slate-200">{profile?.className || "Kelas 8A"}</span>
               <span>•</span>
               <span className="bg-white px-3 py-1 rounded-full border border-slate-200">Semester Genap {profile?.academicYear || "2024/2025"}</span>
            </div>
         </div>
      </div>
      <div className="hidden md:flex bg-white p-5 rounded-2xl shadow-sm border border-slate-100 max-w-[220px] mt-4 md:mt-0 text-sm italic text-slate-600 relative before:absolute before:left-0 before:top-4 before:bottom-4 before:w-1 before:bg-blue-300 before:rounded-r-lg">
         "Belajar hari ini, untuk masa depan yang lebih baik."
         <div className="absolute top-2 right-2 text-emerald-400 opacity-50"><Flame className="w-6 h-6"/></div>
      </div>
    </div>
  );
}
