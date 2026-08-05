import { FileText } from 'lucide-react';
import { ProjectResponse } from '@/types/api';

interface JobDetailDescriptionProps {
  project: ProjectResponse;
}

export function JobDetailDescription({ project }: JobDetailDescriptionProps) {
  const skillsList = project.requiredSkills
    ? project.requiredSkills.split(',').map((s) => s.trim())
    : [];

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
        <FileText className="w-5 h-5 text-emerald-600" />
        <span>Mô Tả Chi Tiết Công Việc</span>
      </h3>

      <div className="text-sm text-slate-600 leading-relaxed space-y-4">
        <p>{project.description}</p>
        <p>
          Chúng tôi mong muốn tìm kiếm ứng viên có tinh thần trách nhiệm cao, có
          khả năng làm việc độc lập hoặc phối hợp nhóm tốt. Đảm bảo bàn giao sản
          phẩm đúng tiến độ cam kết.
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-3">
        <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
          Kỹ năng & Công nghệ yêu cầu
        </h4>
        <div className="flex flex-wrap gap-2">
          {skillsList.map((skill, idx) => (
            <span
              key={idx}
              className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-3 py-1.5 rounded-xl"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
