'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Building2, ExternalLink, Briefcase, DollarSign, CheckCircle2 } from 'lucide-react';
import { clientService } from '@/services/clientService';
import { ClientProfileResponse } from '@/types/api';

interface JobClientSidebarProps {
  clientEmail: string;
  clientId: number;
}

export function JobClientSidebar({ clientEmail, clientId }: JobClientSidebarProps) {
  const [clientProfile, setClientProfile] = useState<ClientProfileResponse | null>(null);

  useEffect(() => {
    if (clientId) {
      clientService
        .getClientProfilePublic(clientId)
        .then((data) => setClientProfile(data))
        .catch(() => setClientProfile(null));
    }
  }, [clientId]);

  return (
    <div className="space-y-6">
      {/* Client Info & Hiring Stats Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between">
          <span>Thông Tin Khách Hàng</span>
          <ShieldCheck className="w-4 h-4 text-emerald-600" aria-label="Đã xác minh doanh nghiệp" />
        </h4>

        <div className="flex items-center space-x-3.5">
          {clientProfile?.avatarUrl ? (
            <img
              src={clientProfile.avatarUrl}
              alt="Logo"
              className="w-12 h-12 rounded-2xl object-cover border border-emerald-500 shadow-xs shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
              {clientProfile?.companyName ? clientProfile.companyName[0].toUpperCase() : clientEmail[0]?.toUpperCase()}
            </div>
          )}

          <div className="overflow-hidden">
            <span className="text-xs text-slate-400 block">Được đăng bởi</span>
            <span className="text-sm font-bold text-slate-900 truncate block">
              {clientProfile?.companyName || clientEmail}
            </span>
            {clientProfile?.industry && (
              <span className="text-[11px] text-emerald-600 font-medium block truncate">
                {clientProfile.industry}
              </span>
            )}
          </div>
        </div>

        {/* Hiring Statistics Overview */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center space-x-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>Dự án đã đăng:</span>
            </span>
            <span className="font-bold text-slate-900">
              {clientProfile ? clientProfile.totalProjectsPosted : '...'} dự án
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Tỷ lệ tuyển dụng:</span>
            </span>
            <span className="font-bold text-emerald-600">
              {clientProfile ? `${clientProfile.hireRate}%` : '...'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center space-x-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              <span>Tổng chi trả:</span>
            </span>
            <span className="font-extrabold text-slate-900">
              {clientProfile?.totalSpent ? `${clientProfile.totalSpent.toLocaleString('vi-VN')} VNĐ` : '0 VNĐ'}
            </span>
          </div>
        </div>

        {/* Link to Full Client Profile */}
        <div className="pt-2">
          <Link
            href={`/clients/${clientId}`}
            className="w-full flex items-center justify-center space-x-1.5 py-2.5 px-4 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Xem Hồ Sơ & Lịch Sử Tuyển Dụng</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </div>
      </div>

      {/* WorkHub Guarantee Box */}
      <div className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/20 space-y-3">
        <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Thanh Toán Bảo Đảm Escrow</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Khoản tiền cho dự án này sẽ được khóa an toàn trên hệ thống WorkHub Escrow và chỉ giải ngân khi bạn hoàn thành dự án theo đúng thỏa thuận.
        </p>
      </div>
    </div>
  );
}
