import React from 'react';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { FreelancerProfileResponse } from '@/types/api';

interface FreelancerDetailHeaderProps {
  freelancer: FreelancerProfileResponse;
  isHired: boolean;
  onHire: () => void;
}

export function FreelancerDetailHeader({
  freelancer,
  isHired,
  onHire,
}: FreelancerDetailHeaderProps) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-3xl shadow-lg shrink-0">
            {freelancer.fullName[0]?.toUpperCase()}
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-900">
                {freelancer.fullName}
              </h1>
              <ShieldCheck className="w-5 h-5 text-emerald-600" aria-label="Đã xác minh" />
            </div>
            <p className="text-sm font-semibold text-slate-600">
              {freelancer.title}
            </p>
            <div className="flex items-center space-x-4 pt-1 text-xs text-slate-500">
              <div className="flex items-center space-x-1 text-amber-600 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{(freelancer.rating ?? 5.0).toFixed(1)} / 5.0</span>
              </div>
              <span>•</span>
              <span>ID: #{freelancer.userId}</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Sẵn sàng nhận việc</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Price Box */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-right w-full sm:w-auto shrink-0 space-y-3">
          <div>
            <span className="text-xs text-slate-400 block">Mức giá theo giờ</span>
            <span className="text-xl font-black text-emerald-600">
              {freelancer.hourlyRate.toLocaleString('vi-VN')} VNĐ/h
            </span>
          </div>

          {isHired ? (
            <div className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-4 py-2 rounded-xl text-center">
              Đã gửi lời mời hợp tác!
            </div>
          ) : (
            <button
              onClick={onHire}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 transition-opacity"
            >
              Mời Hợp Tác Dự Án
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
