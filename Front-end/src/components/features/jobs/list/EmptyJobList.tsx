import { ListFilter } from 'lucide-react';

interface EmptyJobListProps {
  onResetFilters: () => void;
}

export function EmptyJobList({ onResetFilters }: EmptyJobListProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-2xs">
      <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
        <ListFilter className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900">
          Không tìm thấy dự án phù hợp
        </h3>
        <p className="text-xs text-slate-500">
          Thử thay đổi từ khóa hoặc đặt lại bộ lọc tìm kiếm của bạn
        </p>
      </div>
      <button
        onClick={onResetFilters}
        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 hover:cursor-pointer transition-colors shadow-sm shadow-slate-900/10"
      >
        Đặt lại bộ lọc
      </button>
    </div>
  );
}
