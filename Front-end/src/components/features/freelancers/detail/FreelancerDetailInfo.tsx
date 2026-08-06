import React from 'react';
import { Briefcase, Award } from 'lucide-react';
import { FreelancerProfileResponse } from '@/types/api';

interface FreelancerDetailInfoProps {
  freelancer: FreelancerProfileResponse;
}

export function FreelancerDetailInfo({ freelancer }: FreelancerDetailInfoProps) {
  const skillsList = freelancer.skills
    ? freelancer.skills.split(',').map((s) => s.trim())
    : [];

  return (
    <div className="space-y-6">
      {/* About */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-emerald-600" />
          <span>Giới Thiệu Bản Thân</span>
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {freelancer.bio}
        </p>
      </div>

      {/* Skills */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Award className="w-5 h-5 text-emerald-600" />
          <span>Kỹ Năng & Công Nghệ Chuyên Môn</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {skillsList.map((skill, idx) => (
            <span
              key={idx}
              className="bg-white text-slate-600 text-xs px-2.5 py-1 rounded-md border border-slate-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
