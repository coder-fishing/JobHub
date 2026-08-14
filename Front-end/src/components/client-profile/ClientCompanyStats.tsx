import React from 'react';
import { Users, FileText, CheckCircle2, DollarSign, Calendar } from 'lucide-react';
import { ClientProfileResponse } from '@/types/api';

interface ClientCompanyStatsProps {
  client: ClientProfileResponse;
}

export function ClientCompanyStats({ client }: ClientCompanyStatsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Thông Tin Xác Minh & Uy Tín
        </h3>

        <div className="space-y-3.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              <span>Quy mô nhân sự:</span>
            </span>
            <span className="font-semibold text-slate-800">{client.companySize || 'Chưa cập nhật'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Mã số thuế:</span>
            </span>
            <span className="font-mono font-semibold text-slate-800">{client.taxCode || 'Đã xác minh'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Freelancers đã thuê:</span>
            </span>
            <span className="font-bold text-emerald-600">{client.totalHiredCount} người</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center space-x-1.5">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Tổng ngân sách đã chi trả:</span>
            </span>
            <span className="font-extrabold text-emerald-700">
              {client.totalSpent ? client.totalSpent.toLocaleString('vi-VN') : '0'} VNĐ
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-slate-500 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Thành viên từ:</span>
            </span>
            <span className="font-medium text-slate-700">
              {client.memberSince ? new Date(client.memberSince).toLocaleDateString('vi-VN') : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
