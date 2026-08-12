import React from 'react';

interface JobStatusBadgeProps {
  status: string;
}

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  switch (status) {
    case 'OPEN':
      return (
        <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium border border-emerald-200">
          Đang Tuyển Dụng
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium border border-blue-200">
          Đang Thực Hiện
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-medium border border-slate-200">
          Đã Hoàn Thành
        </span>
      );
    default:
      return (
        <span className="bg-slate-100 text-slate-500 text-xs px-2.5 py-1 rounded-full font-medium">
          {status}
        </span>
      );
  }
}
