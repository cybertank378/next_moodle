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
                 priority
                 sizes="(max-width: 768px) 100vw, 96px"
                 className="object-cover"
               />
            </div>
         </div>
         <div>
            <Typography variant="h2" className="text-slate-800 font-bold mb-1 flex items-center gap-2">
              Halo, {profile?.name || "Andi Pratama"}! 👋
            </Typography>
            <Typography variant="body" className="text-slate-600 mb-4 font-medium">
              Terus semangat belajar dan raih cita-citamu!
            </Typography>
            <div className="flex items-center text-sm font-semibold text-slate-500 space-x-2">
               <span>{profile?.schoolName || "SMP Negeri 1 Jakarta"}</span>
               <span>•</span>
               <span>{profile?.className || "Kelas 8A"}</span>
               <span>•</span>
               <span>Semester Genap {profile?.academicYear || "2024/2025"}</span>
            </div>
         </div>
      </div>
      <div className="hidden md:flex bg-blue-100/50 p-5 rounded-2xl max-w-[220px] mt-4 md:mt-0 text-sm font-medium text-slate-700 relative">
         "Belajar hari ini, untuk masa depan yang lebih baik."
         <div className="absolute bottom-2 right-2 text-emerald-500 opacity-60 text-2xl">🍃</div>
      </div>
    </div>
  );
}
