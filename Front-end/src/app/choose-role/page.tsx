'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, UserCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ChooseRolePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'CLIENT' | 'FREELANCER' | null>(null);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      alert("Vui lòng chọn loại tài khoản!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/auth/choose-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          role: selectedRole,
          fullName: fullName.trim() !== '' ? fullName : undefined
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('token', data.token); // update token with new role
        }
        alert("Cập nhật vai trò thành công!");
        window.location.href = '/'; // Dùng window.location.href để load lại toàn bộ app (làm mới layout có chứa navigation role-based)
      } else {
        const errorData = await response.json().catch(() => null);
        alert("Lỗi: " + (errorData?.message || "Không thể cập nhật vai trò"));
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối đến máy chủ Backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50 min-h-screen">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tham gia WorkHub</h1>
          <p className="text-slate-500">Hãy cho chúng tôi biết bạn muốn sử dụng nền tảng với vai trò gì?</p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Option: Client */}
              <label 
                className={`relative flex flex-col items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedRole === 'CLIENT' 
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-500/10' 
                    : 'border-slate-200 hover:border-emerald-200 hover:bg-slate-50'
                }`}
              >
                <input 
                  type="radio" 
                  name="role" 
                  value="CLIENT" 
                  checked={selectedRole === 'CLIENT'}
                  onChange={() => setSelectedRole('CLIENT')}
                  className="sr-only"
                />
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${
                  selectedRole === 'CLIENT' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${selectedRole === 'CLIENT' ? 'text-emerald-700' : 'text-slate-900'}`}>
                  Khách hàng
                </h3>
                <p className="text-xs text-center text-slate-500 leading-relaxed">
                  Tôi muốn đăng dự án và tìm kiếm Freelancer tài năng.
                </p>
                {selectedRole === 'CLIENT' && (
                  <div className="absolute top-4 right-4 text-emerald-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
              </label>

              {/* Option: Freelancer */}
              <label 
                className={`relative flex flex-col items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedRole === 'FREELANCER' 
                    ? 'border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10' 
                    : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                }`}
              >
                <input 
                  type="radio" 
                  name="role" 
                  value="FREELANCER" 
                  checked={selectedRole === 'FREELANCER'}
                  onChange={() => setSelectedRole('FREELANCER')}
                  className="sr-only"
                />
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${
                  selectedRole === 'FREELANCER' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  <UserCircle className="w-7 h-7" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${selectedRole === 'FREELANCER' ? 'text-blue-700' : 'text-slate-900'}`}>
                  Freelancer
                </h3>
                <p className="text-xs text-center text-slate-500 leading-relaxed">
                  Tôi muốn tìm kiếm công việc và kiếm tiền từ kỹ năng.
                </p>
                {selectedRole === 'FREELANCER' && (
                  <div className="absolute top-4 right-4 text-blue-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
              </label>

            </div>

            {selectedRole && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Xác nhận Họ và Tên (Không bắt buộc)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ tên của bạn nếu muốn cập nhật"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Nếu bạn đã nhập Họ và Tên khi đăng ký, bạn có thể bỏ qua bước này.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedRole}
              className={`w-full text-white font-semibold text-sm py-4 rounded-xl shadow-md flex items-center justify-center space-x-2 group transition-all ${
                !selectedRole 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : selectedRole === 'CLIENT' 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <span>{loading ? 'Đang cập nhật...' : 'Xác nhận và Tiếp tục'}</span>
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
