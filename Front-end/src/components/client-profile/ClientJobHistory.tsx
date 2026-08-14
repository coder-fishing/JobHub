import React from 'react';
import Link from 'next/link';
import { Briefcase, DollarSign, Calendar } from 'lucide-react';
import { ClientJobHistoryDTO } from '@/types/api';
import { JobStatusBadge } from './JobStatusBadge';

interface ClientJobHistoryProps {
  jobs: ClientJobHistoryDTO[];
}

export function ClientJobHistory({ jobs }: ClientJobHistoryProps) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-emerald-600" />
          <span>Lịch Sử Đăng Tuyển Dự Án ({jobs.length})</span>
        </h3>
      </div>

      {jobs.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {jobs.map((job) => (
            <div key={job.id} className="py-4 space-y-2 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-4">
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors line-clamp-1"
                >
                  {job.title}
                </Link>
                <JobStatusBadge status={job.status} />
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="font-semibold text-emerald-600 flex items-center space-x-1">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Ngân sách: {job.budget?.toLocaleString('vi-VN')} VNĐ</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Đăng ngày: {new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 py-4 text-center">
          Chưa có lịch sử đăng dự án nào.
        </p>
      )}
    </div>
  );
}
