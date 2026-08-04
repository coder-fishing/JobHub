import { Clock, MapPin, Users } from 'lucide-react';
import Link from 'next/link';

interface JobCardProps {
  id: number;
  title: string;
  type: string;
  budget: string;
  location: string;
  postedAt: string;
  proposals: number;
  skills: string[];
  urgent?: boolean;
}

export function JobCard({
  id,
  title,
  type,
  budget,
  location,
  postedAt,
  proposals,
  skills,
  urgent
}: JobCardProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div className="space-y-3 flex-1">
        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          {urgent && (
            <span className="bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Cần gấp
            </span>
          )}
          <span className="bg-slate-100 text-slate-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-slate-200">
            {type}
          </span>
          <span className="text-slate-400 text-xs flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{postedAt}</span>
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 hover:text-emerald-600 transition-colors">
          <Link href={`/jobs/${id}`}>{title}</Link>
        </h3>

        <div className="flex items-center space-x-6 text-xs text-slate-500 flex-wrap gap-y-2">
          <span className="font-semibold text-emerald-600 text-sm">{budget}</span>
          <span className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{location}</span>
          </span>
          <span className="flex items-center space-x-1 text-slate-600">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span>{proposals} đề xuất chào thầu</span>
          </span>
        </div>

        {/* Skill Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          {skills.map((skill, idx) => (
            <span key={idx} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg border border-slate-200">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="shrink-0 flex lg:flex-col items-center justify-between lg:justify-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
        <Link
          href={`/jobs/${id}`}
          className="gradient-button text-white font-medium text-sm px-6 py-2.5 rounded-xl text-center w-full sm:w-auto shadow-sm"
        >
          Gửi Báo Giá
        </Link>
      </div>
    </div>
  );
}