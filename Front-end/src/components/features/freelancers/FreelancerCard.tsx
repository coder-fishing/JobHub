import Link from 'next/link';
import { Star, Mail, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { FreelancerProfileResponse } from '@/types/api';

interface FreelancerCardProps {
  freelancer: FreelancerProfileResponse;
}

export function FreelancerCard({ freelancer }: FreelancerCardProps) {
  const skillsList = freelancer.skills
    ? freelancer.skills.split(',').map((s) => s.trim())
    : [];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all space-y-5 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header Info */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shrink-0">
              {freelancer.fullName[0]?.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-slate-900 text-base hover:text-emerald-600 transition-colors">
                  <Link href={`/freelancers/${freelancer.userId}`}>
                    {freelancer.fullName}
                  </Link>
                </h3>
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Đã xác minh" />
              </div>
              <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                {freelancer.title}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-full text-amber-700 text-xs font-semibold shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{(freelancer.rating ?? 5.0).toFixed(1)}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          {freelancer.bio}
        </p>

        {/* Skills Tag */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {skillsList.slice(0, 5).map((skill, idx) => (
            <span
              key={idx}
              className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-200/60"
            >
              {skill}
            </span>
          ))}
          {skillsList.length > 5 && (
            <span className="bg-slate-50 text-slate-400 text-[11px] font-medium px-2 py-1 rounded-lg border border-slate-200/60">
              +{skillsList.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 block uppercase font-medium">Mức giá giờ</span>
          <span className="text-sm font-extrabold text-emerald-600">
            {freelancer.hourlyRate.toLocaleString('vi-VN')} VNĐ/h
          </span>
        </div>

        <Link
          href={`/freelancers/${freelancer.userId}`}
          className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <span>Xem Hồ Sơ</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
