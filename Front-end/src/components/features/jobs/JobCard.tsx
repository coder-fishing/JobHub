'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProjectResponse } from '@/types/api';
import { Mail, Calendar, Users, ChevronRight } from 'lucide-react';

interface JobCardProps {
  project: ProjectResponse;
}

export function JobCard({ project }: JobCardProps) {
  const router = useRouter();

  // Split requiredSkills String ("Next.js, React, TailwindCSS") into Array
  const skillsList = project.requiredSkills
    ? project.requiredSkills.split(',').map((s) => s.trim())
    : [];

  const handleCardClick = () => {
    router.push(`/jobs/${project.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-200 cursor-pointer space-y-4 group"
    >
      {/* Top Bar: Status + Email & Deadline */}
      <div className="flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <span className="bg-emerald-100/70 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
            {project.status}
          </span>
          <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>{project.clientEmail}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-slate-500 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Hạn chót: {project.deadline}</span>
        </div>
      </div>

      {/* Middle Section: Title, Description & Budget Box */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1 pr-2">
          <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug">
            {project.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Budget Green Box */}
        <div className="bg-emerald-50/80 border border-emerald-100/80 rounded-2xl p-4 shrink-0 text-left min-w-[210px] md:text-left">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600/90 block mb-1">
            NGÂN SÁCH DỰ KIẾN
          </span>
          <span className="text-lg font-black text-slate-900 block">
            {project.budget.toLocaleString('vi-VN')} VNĐ
          </span>
        </div>
      </div>

      {/* Separator Line */}
      <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Footer: Max Freelancers Pill & Skills */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Max Freelancers Pill Badge */}
          <div className="bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Tối đa {project.maxFreelancers} Freelancer</span>
          </div>

          {/* Skill Pills */}
          {skillsList.map((skill, idx) => (
            <span
              key={idx}
              className="bg-slate-50 border border-slate-200/80 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-xl"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Right Footer: Submit Button */}
        <div className="shrink-0">
          <Link
            href={`/jobs/${project.id}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm group-hover:shadow-md"
          >
            <span>Gửi Báo Giá</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}