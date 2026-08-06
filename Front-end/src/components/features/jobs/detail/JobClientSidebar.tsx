import { ShieldCheck } from 'lucide-react';

interface JobClientSidebarProps {
  clientEmail: string;
  clientId: number;
}

export function JobClientSidebar({ clientEmail, clientId }: JobClientSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Client Info Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
          Thông Tin Khách Hàng
        </h4>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
            {clientEmail[0]?.toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <span className="text-xs text-slate-400 block">Được đăng bởi</span>
            <span className="text-sm font-bold text-slate-900 truncate block">
              {clientEmail}
            </span>
          </div>
        </div>

        <div className="pt-2 text-xs space-y-2.5 text-slate-600">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Xác minh danh tính</span>
            <span className="text-emerald-600 font-semibold flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Đã xác minh</span>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Client ID</span>
            <span className="font-mono text-slate-900 font-semibold">
              #{clientId}
            </span>
          </div>
        </div>
      </div>

      {/* WorkHub Guarantee Box */}
      <div className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/20 space-y-3">
        <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>Thanh Toán Bảo Đảm Escrow</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Khoản tiền cho dự án này sẽ được khóa an toàn trên hệ thống WorkHub Escrow và chỉ giải ngân khi bạn hoàn thành dự án theo đúng thỏa thuận.
        </p>
      </div>
    </div>
  );
}
