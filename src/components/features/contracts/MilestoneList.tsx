import React from 'react';
import { MilestoneResponse } from '@/types/api';
import { ShieldCheck, Lock, CheckCircle2, Clock, Send, DollarSign } from 'lucide-react';

interface MilestoneListProps {
  milestones: MilestoneResponse[];
  onLockEscrow: (milestoneId: number) => void;
  onSubmitWork: (milestoneId: number) => void;
  onReleaseFunds: (milestoneId: number) => void;
}

export function MilestoneList({
  milestones,
  onLockEscrow,
  onSubmitWork,
  onReleaseFunds,
}: MilestoneListProps) {
  const getStatusBadge = (status: MilestoneResponse['status']) => {
    switch (status) {
      case 'RELEASED':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Đã Giải Ngân Thanh Toán</span>
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center space-x-1">
            <Send className="w-3.5 h-3.5 text-blue-600" />
            <span>Freelancer Đã Nộp Bài</span>
          </span>
        );
      case 'ESCROW_LOCKED':
        return (
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center space-x-1">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span>Đã Khóa Ký Quỹ Escrow</span>
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Chưa Ký Quỹ</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Danh Sách Giai Đoạn Thanh Toán (Milestones & Escrow)</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Tiền từng giai đoạn được giữ an toàn trên WorkHub Escrow và giải ngân sau khi kiểm thử đạt yêu cầu.
        </p>
      </div>

      <div className="space-y-4">
        {milestones.map((ms, index) => (
          <div
            key={ms.id}
            className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 hover:bg-white transition-all shadow-2xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Milestone #{index + 1}
                </span>
                <h4 className="font-bold text-slate-900 text-base">
                  {ms.title}
                </h4>
                <span className="text-xs text-slate-400 block">
                  Hạn hoàn thành: {new Date(ms.dueDate).toLocaleDateString('vi-VN')}
                </span>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400 block font-medium">Giá trị giai đoạn</span>
                <span className="text-lg font-black text-emerald-600">
                  {ms.amount.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            </div>

            {/* Status & Action Buttons Bar */}
            <div className="pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-3">
              <div>{getStatusBadge(ms.status)}</div>

              <div className="flex items-center space-x-2">
                {ms.status === 'PENDING' && (
                  <button
                    onClick={() => onLockEscrow(ms.id)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm inline-flex items-center space-x-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Client Ký Quỹ Escrow</span>
                  </button>
                )}

                {ms.status === 'ESCROW_LOCKED' && (
                  <button
                    onClick={() => onSubmitWork(ms.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm inline-flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Freelancer Nộp Bài Giai Đoạn</span>
                  </button>
                )}

                {ms.status === 'SUBMITTED' && (
                  <button
                    onClick={() => onReleaseFunds(ms.id)}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white text-xs font-bold rounded-xl transition-opacity shadow-md inline-flex items-center space-x-1.5"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Client Duyệt & Giải Ngân Money</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
