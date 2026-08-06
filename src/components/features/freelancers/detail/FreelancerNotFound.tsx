import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export function FreelancerNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
      <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
      <h2 className="text-2xl font-bold text-slate-900">Freelancer không tồn tại</h2>
      <p className="text-sm text-slate-500">
        Hồ sơ chuyên gia này có thể đã bị gỡ hoặc sai đường dẫn.
      </p>
      <Link
        href="/freelancers"
        className="inline-block bg-slate-900 text-white font-medium text-sm px-6 py-2.5 rounded-xl"
      >
        Quay lại danh sách Freelancer
      </Link>
    </div>
  );
}
