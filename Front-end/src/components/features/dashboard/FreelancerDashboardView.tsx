import React from 'react';
import Link from 'next/link';
import { ProposalResponse } from '@/types/api';
import { CheckCircle2, XCircle, Clock, ArrowRight, FileText } from 'lucide-react';

interface FreelancerDashboardViewProps {
  proposals: ProposalResponse[];
}

export function FreelancerDashboardView({ proposals }: FreelancerDashboardViewProps) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Báo Giá / Đề Xuất Đã Nộp ({proposals.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi danh sách các bài chào thầu bạn đã gửi cho khách hàng
          </p>
        </div>

        <Link
          href="/jobs"
          className="text-xs font-bold text-emerald-600 hover:underline"
        >
          + Tìm thêm công việc
        </Link>
      </div>

      <div className="space-y-4">
        {proposals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 font-medium">Bạn chưa nộp báo giá nào.</p>
          </div>
        ) : (
          proposals.map((proposal) => (
          <div
            key={proposal.id}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Dự án thầu:</span>
                <h4 className="font-bold text-slate-900 text-base">
                  <Link href={`/jobs/${proposal.projectId}`} className="hover:text-emerald-600 transition-colors">
                    {proposal.projectTitle || `Dự án #${proposal.projectId}`}
                  </Link>
                </h4>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] text-slate-400 block">Giá thầu của bạn</span>
                <span className="text-base font-extrabold text-emerald-600">
                  {proposal.proposedPrice?.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl space-y-1">
              <span className="font-semibold text-slate-800 block">Thời gian ước tính: {proposal.estimatedDays} ngày</span>
              <span className="font-semibold text-slate-800 block mt-2">Thư giới thiệu của bạn:</span>
              <p className="leading-relaxed whitespace-pre-wrap">{proposal.coverLetter}</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Ngày gửi: {new Date(proposal.createdAt).toLocaleDateString('vi-VN')}
              </span>

              <div>
                {proposal.status === 'ACCEPTED' ? (
                  <div className="flex items-center space-x-2">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã Được Chấp Nhận!</span>
                    </span>
                    <Link
                      href="/contracts/1001"
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center space-x-1"
                    >
                      <span>Xem Hợp Đồng & Làm Việc</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : proposal.status === 'REJECTED' ? (
                  <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center space-x-1">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Không Được Chọn</span>
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Đang Chờ Xem Xét...</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}
