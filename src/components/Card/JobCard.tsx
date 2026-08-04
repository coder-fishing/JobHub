import Link from 'next/link';
import { ProjectResponse } from '@/types/api';
import { Clock, MapPin, Users, Building2, Calendar } from 'lucide-react';

interface JobCardProps {
  project: ProjectResponse;
}

export function JobCard({ project }: JobCardProps) {
  // Split requiredSkills String ("Next.js, React, TailwindCSS") into Array
  const skillsList = project.requiredSkills
    ? project.requiredSkills.split(',').map((s) => s.trim())
    : [];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-start justify-between gap-6 ">
      <div className="space-y-3 flex-1 min-w-0">
        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase">
            {project.status}
          </span>
          <span className="text-slate-500 text-xs flex items-center space-x-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{project.clientEmail}</span>
          </span>
          <span className="text-slate-400 text-xs flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Hạn chót: {project.deadline}</span>
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 hover:text-emerald-600 transition-colors leading-snug">
          <Link href={`/jobs/${project.id}`}>{project.title}</Link>
        </h3>

        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        <div className="flex items-center space-x-6 text-xs text-slate-500 flex-wrap gap-y-2 pt-1">
          <span className="font-bold text-emerald-600 text-base">
            {project.budget.toLocaleString('vi-VN')} VNĐ
          </span>
          <span className="flex items-center space-x-1 text-slate-600">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>Tối đa {project.maxFreelancers} Freelancer</span>
          </span>
        </div>

        {/* Skill Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          {skillsList.map((skill, idx) => (
            <span key={idx} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg border border-slate-200">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="shrink-0 flex sm:flex-col items-center justify-between sm:justify-start gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <Link
          href={`/jobs/${project.id}`}
          className="gradient-button text-white font-medium text-sm px-6 py-2.5 rounded-xl text-center w-full sm:w-auto shadow-sm whitespace-nowrap"
        >
          Gửi Báo Giá
        </Link>
      </div>
    </div>
  );
}