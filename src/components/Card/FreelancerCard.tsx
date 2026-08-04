import { Star } from 'lucide-react';
import Link from 'next/link';

interface FreelancerCardProps {
  id: number;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  hourlyRate: string;
  completedJobs: number;
  skills: string[];
  avatarBg: string;
}

export function FreelancerCard({
  id,
  name,
  role,
  rating,
  reviews,
  hourlyRate,
  completedJobs,
  skills,
  avatarBg
}: FreelancerCardProps) {
  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-5 hover:border-emerald-500 hover:shadow-lg transition-all">
      <div className="flex items-center space-x-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${avatarBg} flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0`}>
          {name.split(' ').pop()?.[0]}
        </div>
        <div>
          <h3 className="text-slate-900 font-bold text-base">{name}</h3>
          <p className="text-slate-500 text-xs mt-0.5">{role}</p>
          <div className="flex items-center space-x-1.5 mt-1 text-xs">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-slate-900 font-semibold">{rating}</span>
            <span className="text-slate-400">({reviews} đánh giá)</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 block">Mức thù lao</span>
          <span className="text-slate-900 font-semibold text-sm">{hourlyRate}</span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 block">Dự án hoàn thành</span>
          <span className="text-emerald-600 font-semibold text-sm">{completedJobs} dự án</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {skills.map((s, i) => (
          <span key={i} className="bg-white text-slate-600 text-xs px-2.5 py-1 rounded-md border border-slate-200">
            {s}
          </span>
        ))}
      </div>

      <Link
        href={`/freelancers/${id}`}
        className="block text-center bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs py-2.5 rounded-xl border border-slate-200 transition-colors shadow-2xs"
      >
        Xem Hồ Sơ & Thuê
      </Link>
    </div>
  );
}