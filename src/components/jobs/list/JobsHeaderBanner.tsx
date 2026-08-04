import { Briefcase } from 'lucide-react';

interface JobsHeaderBannerProps {
  sortBy: 'newest' | 'budget_high' | 'budget_low';
  onSortChange: (sortBy: 'newest' | 'budget_high' | 'budget_low') => void;
}

export function JobsHeaderBanner({ sortBy, onSortChange }: JobsHeaderBannerProps) {
  return (
    <div className="bg-white border-b border-slate-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-2">
              <Briefcase className="w-4 h-4" />
              <span>Khám phá cơ hội nghề nghiệp</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Danh Sách Dự Án Đang Tuyển
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Tìm kiếm và gửi báo giá cho các dự án công nghệ phù hợp nhất với chuyên môn của bạn
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
            <span className="text-xs text-slate-500 font-medium pl-2">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-white text-xs font-medium text-slate-800 rounded-lg px-3 py-2 border border-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="newest" className="text-slate-800">
                Mới nhất
              </option>
              <option value="budget_high" className="text-slate-800">
                Ngân sách cao nhất
              </option>
              <option value="budget_low" className="text-slate-800">
                Ngân sách thấp nhất
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
