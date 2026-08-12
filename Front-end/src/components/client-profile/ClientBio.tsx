import React from 'react';
import { FileText } from 'lucide-react';

interface ClientBioProps {
  bio?: string;
}

export function ClientBio({ bio }: ClientBioProps) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
      <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
        <FileText className="w-5 h-5 text-emerald-600" />
        <span>Giới Thiệu Về Doanh Nghiệp</span>
      </h3>
      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
        {bio || 'Khách hàng chưa cập nhật mô tả chi tiết về doanh nghiệp.'}
      </p>
    </div>
  );
}
