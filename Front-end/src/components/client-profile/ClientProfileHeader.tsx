import React from 'react';
import { Building2, ShieldCheck, Briefcase, MapPin, Globe } from 'lucide-react';
import { ClientProfileResponse } from '@/types/api';

interface ClientProfileHeaderProps {
  client: ClientProfileResponse;
}

export function ClientProfileHeader({ client }: ClientProfileHeaderProps) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="flex items-center space-x-5">
        {client.avatarUrl ? (
          <img
            src={client.avatarUrl}
            alt={client.companyName}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white font-extrabold text-2xl shadow-md shrink-0">
            <Building2 className="w-10 h-10 text-white" />
          </div>
        )}

        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900">
              {client.companyName || client.email}
            </h1>
            <ShieldCheck className="w-5 h-5 text-emerald-600" title="Doanh nghiệp đã xác minh" />
          </div>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
            {client.industry && (
              <span className="flex items-center space-x-1 font-medium text-slate-700">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                <span>{client.industry}</span>
              </span>
            )}
            {client.location && (
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{client.location}</span>
              </span>
            )}
            {client.companyWebsite && (
              <a
                href={client.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-emerald-600 hover:underline font-medium"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Website chính thức</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-center space-x-6 text-center shrink-0 w-full md:w-auto justify-around">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold block">
            Dự Án Đã Đăng
          </span>
          <span className="text-xl font-black text-emerald-900">{client.totalProjectsPosted}</span>
        </div>
        <div className="h-8 w-px bg-emerald-200" />
        <div>
          <span className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold block">
            Tỷ Lệ Tuyển
          </span>
          <span className="text-xl font-black text-emerald-900">{client.hireRate}%</span>
        </div>
      </div>
    </div>
  );
}
