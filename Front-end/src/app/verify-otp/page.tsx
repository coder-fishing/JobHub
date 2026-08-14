'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Mail, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import Link from 'next/link';

function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Nếu không có email trên URL thì về trang đăng ký
      router.push('/register');
    }
  }, [searchParams, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      alert("Vui lòng nhập đủ 6 số OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/register/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otpCode
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Lưu token vào localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        alert("Xác thực tài khoản thành công!");
        
        // Nếu đã xác thực xong, chuyển hướng tới trang choose-role hoặc dashboard tùy ý
        // Ở đây hệ thống đang yêu cầu role=null thì qua choose-role, nếu có thì dashboard.
        if (!data.role) {
           router.push('/choose-role'); // giả sử bạn có trang này
        } else {
           router.push('/');
        }
      } else {
        const errorData = await response.json().catch(() => null);
        alert("Xác thực thất bại: " + (errorData?.message || "Mã OTP không đúng hoặc đã hết hạn"));
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối đến máy chủ Backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        
        {/* Header text */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Xác thực Email</h1>
          <p className="text-sm text-slate-500">
            Chúng tôi đã gửi mã xác thực gồm 6 chữ số đến email <br/>
            <span className="font-semibold text-slate-900">{email}</span>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <form onSubmit={handleVerify} className="space-y-6">
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 text-center">
                Mã OTP (6 số)
              </label>
              <div className="relative flex justify-center">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••••"
                  className="w-3/4 bg-slate-50 border border-slate-200 text-slate-900 text-2xl tracking-[0.5em] text-center rounded-xl py-3 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="w-full gradient-button text-white font-semibold text-sm py-3.5 rounded-xl shadow-md flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(to right, #10b981, #059669)' }}
            >
              <span>{loading ? 'Đang xác thực...' : 'Xác thực ngay'}</span>
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="text-center">
             <Link href="/login" className="text-sm text-emerald-600 font-medium hover:underline flex justify-center items-center gap-2">
                Quay lại đăng nhập
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8">Đang tải...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
