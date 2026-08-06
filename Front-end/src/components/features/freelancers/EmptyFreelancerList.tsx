import { UserX } from 'lucide-react';

interface EmptyFreelancerListProps {
  onReset: () => void;
}

export function EmptyFreelancerList({ onReset }: EmptyFreelancerListProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto shadow-2xs">
      <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
        <UserX className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900">
          Không tìm thấy Freelancer nào
        </h3>
        <p className="text-xs text-slate-500">
          Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt tiêu chí lọc
        </p>
      </div>
      <button
        onClick={onReset}
        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
      >
        Đặt lại từ khóa
      </button>
    </div>
  );
}
