import React from 'react';
import { User, ShieldCheck } from 'lucide-react';

interface ProfileHeaderProps {
  fullName: string;
  title: string;
  email: string;
  avatarUrl?: string;
  role?: string;
}

export function ProfileHeader({ fullName, title, email, avatarUrl, role }: ProfileHeaderProps) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={fullName}
          className="w-20 h-20 rounded-3xl object-cover border-2 border-emerald-500 shadow-lg shrink-0"
        />
      ) : (
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-3xl shadow-lg shrink-0">
          {fullName[0]?.toUpperCase() || <User className="w-10 h-10 text-white" />}
        </div>
      )}

      <div className="space-y-1 text-center sm:text-left flex-1">
        <div className="flex items-center justify-center sm:justify-start space-x-2">
          <h1 className="text-2xl font-extrabold text-slate-900">{fullName}</h1>
          <ShieldCheck className="w-5 h-5 text-emerald-600" aria-label="Đã xác minh" />
          {role && (
            <span className="text-[10px] uppercase bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full ml-2">
              {role}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-slate-600">{title}</p>
        <p className="text-xs text-slate-400 font-mono">{email}</p>
      </div>
    </div>
  );
}
