import React from 'react';
import Link from 'next/link';
import { ProjectResponse, ProposalResponse } from '@/types/api';
import { CheckCircle2, XCircle, Clock, ArrowRight, User } from 'lucide-react';

interface ClientDashboardViewProps {
  projects: ProjectResponse[];
  proposals: ProposalResponse[];
  onAcceptProposal: (id: number) => void;
  onRejectProposal: (id: number) => void;
}

export function ClientDashboardView({
  projects,
  proposals,
  onAcceptProposal,
  onRejectProposal,
}: ClientDashboardViewProps) {
  return (
    <div className="space-y-8">
      {/* Client Projects List */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900">
            Dự Án Bạn Đã Đăng ({projects.length})
          </h3>
          <Link
            href="/jobs/create"
            className="text-xs font-bold text-emerald-600 hover:underline"
          >
            + Đăng dự án mới
          </Link>
        </div>

        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  {project.status}
                </span>
                <h4 className="font-bold text-slate-900 text-base">
                  <Link href={`/jobs/${project.id}`} className="hover:text-emerald-600 transition-colors">
                    {project.title}
                  </Link>
                </h4>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {project.description}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400 block">Ngân sách</span>
                <span className="text-base font-extrabold text-emerald-600">
                  {project.budget.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proposals Received */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900">
            Đề Xuất Chào Thầu Từ Freelancers ({proposals.length})
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Xem xét phương án triển khai & mức giá thầu để phê duyệt Freelancer phù hợp
          </p>
        </div>

        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {proposal.freelancerName[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">
                      {proposal.freelancerName}
                    </h5>
                    <span className="text-xs text-slate-400 font-mono">
                      {proposal.freelancerEmail}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Giá chào thầu</span>
                  <span className="text-base font-extrabold text-emerald-600">
                    {proposal.proposalBid.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl space-y-1">
                <span className="font-semibold text-slate-800 block">Thư giới thiệu & Phương án:</span>
                <p className="leading-relaxed">{proposal.coverLetter}</p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  Dự án: <strong>{proposal.projectTitle}</strong>
                </span>

                <div className="flex items-center space-x-2">
                  {proposal.status === 'ACCEPTED' ? (
                    <div className="flex items-center space-x-2">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đã Chấp Nhận</span>
                      </span>
                      <Link
                        href="/contracts/1001"
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center space-x-1"
                      >
                        <span>Xem Hợp Đồng & Escrow</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : proposal.status === 'REJECTED' ? (
                    <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center space-x-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Đã Từ Chối</span>
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => onRejectProposal(proposal.id)}
                        className="px-3.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Từ Chối
                      </button>
                      <button
                        onClick={() => onAcceptProposal(proposal.id)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                      >
                        Chấp Nhận Chào Thầu
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
