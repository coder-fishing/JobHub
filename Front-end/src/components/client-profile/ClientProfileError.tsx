import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ClientProfileErrorProps {
  errorMsg?: string | null;
}

export function ClientProfileError({ errorMsg }: ClientProfileErrorProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
      <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
        !
      </div>
      <h2 className="text-xl font-bold text-slate-800">Khách Hàng Không Tồn Tại</h2>
      <p className="text-sm text-slate-500">{errorMsg || 'Không tìm thấy hồ sơ của công ty này.'}</p>
      <Link
        href="/jobs"
        className="inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay Lại Danh Sách Dự Án</span>
      </Link>
    </div>
  );
}
