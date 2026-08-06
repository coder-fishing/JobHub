import React from 'react';
import Link from 'next/link';
import { ContractResponse } from '@/types/api';
import { ShieldCheck, Calendar, DollarSign, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface ContractHeaderProps {
  contract: ContractResponse;
}

export function ContractHeader({ contract }: ContractHeaderProps) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
            Hợp Đồng: #{contract.id}
          </span>
          <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
            Trạng thái: {contract.status}
          </span>
        </div>

        <span className="text-xs text-slate-400">
          Ngày khởi tạo: {new Date(contract.createdAt).toLocaleDateString('vi-VN')}
        </span>
      </div>

      {/* Project Title */}
      <div className="space-y-1">
        <span className="text-xs text-slate-400 block font-medium">Dự án thuộc hợp đồng:</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
          <Link href={`/jobs/${contract.projectId}`} className="hover:text-emerald-600 transition-colors">
            {contract.projectTitle}
          </Link>
        </h1>
      </div>

      {/* Contract Participants & Total Budget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
        <div>
          <span className="text-xs text-slate-400 block">Khách hàng (Client)</span>
          <span className="text-sm font-bold text-slate-800 truncate block">
            {contract.clientEmail}
          </span>
        </div>

        <div>
          <span className="text-xs text-slate-400 block">Freelancer đảm nhận</span>
          <span className="text-sm font-bold text-slate-800 truncate block">
            {contract.freelancerName} ({contract.freelancerEmail})
          </span>
        </div>

        <div>
          <span className="text-xs text-slate-400 block">Tổng giá trị hợp đồng</span>
          <span className="text-lg font-black text-emerald-600">
            {contract.totalAmount.toLocaleString('vi-VN')} VNĐ
          </span>
        </div>
      </div>
    </div>
  );
}
