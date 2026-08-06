import Link from 'next/link';
import { ArrowLeft, Briefcase } from 'lucide-react';

export function CreateProjectHeader() {
  return (
    <>
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/jobs"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách việc làm</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="mb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider">
          <Briefcase className="w-4 h-4" />
          <span>Dành cho Khách Hàng / Nhàn Rỗi</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Đăng Dự Án / Tuyển Freelancer
        </h1>
        <p className="text-sm text-slate-500">
          Mô tả yêu cầu công việc để tiếp cận hàng ngàn Freelancer chất lượng cao trên WorkHub.
        </p>
      </div>
    </>
  );
}
