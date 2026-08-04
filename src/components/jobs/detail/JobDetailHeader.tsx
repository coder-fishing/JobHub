import { Bookmark, Share2 } from 'lucide-react';
import { ProjectResponse } from '@/types/api';

interface JobDetailHeaderProps {
  project: ProjectResponse;
}

export function JobDetailHeader({ project }: JobDetailHeaderProps) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
          Trạng thái: {project.status}
        </span>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
        {project.title}
      </h1>

      {/* Key Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
        <div>
          <span className="text-xs text-slate-400 block">Ngân sách dự án</span>
          <span className="text-lg font-bold text-emerald-600">
            {project.budget.toLocaleString('vi-VN')} VNĐ
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">Tuyển tối đa</span>
          <span className="text-base font-semibold text-slate-800">
            {project.maxFreelancers} Freelancer
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block">Hạn chót chào thầu</span>
          <span className="text-base font-semibold text-slate-800">
            {project.deadline}
          </span>
        </div>
      </div>
    </div>
  );
}
