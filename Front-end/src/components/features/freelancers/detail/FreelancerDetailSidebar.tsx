import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { FreelancerProfileResponse } from '@/types/api';

interface FreelancerDetailSidebarProps {
  freelancer: FreelancerProfileResponse;
}

export function FreelancerDetailSidebar({ freelancer }: FreelancerDetailSidebarProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
          Thông Tin Liên Hệ
        </h4>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Email</span>
            <span className="font-semibold text-slate-800">ID: {freelancer.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Trạng thái danh tính</span>
            <span className="text-emerald-600 font-semibold">Đã xác minh</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Thời gian phản hồi</span>
            <span className="font-semibold text-slate-800">&lt; 2 giờ</span>
          </div>
        </div>
      </div>

      {/* Escrow Guarantee */}
      <div className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/20 space-y-3">
        <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Bảo Đảm WorkHub</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Mọi giao dịch làm việc với Freelancer này đều được bảo vệ bởi hệ thống WorkHub Escrow.
        </p>
      </div>
    </div>
  );
}
