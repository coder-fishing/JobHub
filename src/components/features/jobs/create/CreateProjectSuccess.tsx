import { CheckCircle2 } from 'lucide-react';

export function CreateProjectSuccess() {
  return (
    <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-3">
      <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
      <h3 className="text-lg font-bold text-emerald-900">
        Tạo Dự Án Thành Công!
      </h3>
      <p className="text-xs text-emerald-700">
        Dự án của bạn đã được đăng lên hệ thống. Đang chuyển hướng về danh sách công việc...
      </p>
    </div>
  );
}
