import React from 'react';
import { Briefcase, Send, CheckCircle2, Clock } from 'lucide-react';

interface DashboardHeaderProps {
  role: 'client' | 'freelancer';
  onRoleChange: (role: 'client' | 'freelancer') => void;
  totalProjects: number;
  totalProposals: number;
}

export function DashboardHeader({
  role,
  onRoleChange,
  totalProjects,
  totalProposals,
}: DashboardHeaderProps) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-2">
            <Briefcase className="w-4 h-4" />
            <span>Trung tâm quản lý hoạt động</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Dashboard Tổng Quan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi tiến độ dự án, báo giá chào thầu và hợp tác hoạt động
          </p>
        </div>

        {/* The Role Switcher Tab has been removed as role is now authenticated and fixed */}
        <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 flex items-center space-x-2 text-xs font-semibold self-start md:self-auto px-4 py-2.5">
          <span className="text-slate-500">Vai trò hiện tại:</span>
          <span className="text-slate-900 font-bold uppercase">{role === 'client' ? 'Khách Hàng' : 'Freelancer'}</span>
        </div>
      </div>

      {/* Stats Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              {role === 'client' ? 'Dự án đã đăng' : 'Dự án đang chào thầu'}
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              {totalProjects}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">
              {role === 'client' ? 'Số lượt Báo giá nhận được' : 'Báo giá đã gửi'}
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              {totalProposals}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Trạng thái Escrow</span>
            <span className="text-xs font-bold text-emerald-600">Đã khóa bảo đảm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
