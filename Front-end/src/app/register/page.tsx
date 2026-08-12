'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Sparkles, User } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          fullName
        }),
      });

      if (response.ok) {
        // alert("Đăng ký thành công! Vui lòng kiểm tra email để nhận mã OTP.");
        window.location.href = `/verify-otp?email=${encodeURIComponent(email)}`;
      } else {
        const errorData = await response.json().catch(() => null);
        alert("Đăng ký thất bại: " + (errorData?.message || "Lỗi không xác định"));
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối đến máy chủ Backend!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/5 blur-[130px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* Header text */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bắt đầu hành trình mới</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Đăng Ký WorkHub</h1>
            <p className="text-sm text-slate-500">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-emerald-600 font-medium hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </div>



          {/* Form Card */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Họ và Tên
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@domain.com"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" required className="w-4 h-4 rounded bg-slate-100 border-slate-300 text-emerald-600 focus:ring-emerald-500/40" />
                  <span>Tôi đồng ý với Điều khoản dịch vụ</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-button text-white font-semibold text-sm py-3.5 rounded-xl shadow-md flex items-center justify-center space-x-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(to right, #10b981, #059669)' }} // matching original CSS
              >
                <span>{isLoading ? 'Đang xử lý...' : 'Đăng Ký Tài Khoản'}</span>
                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-slate-400">Hoặc tiếp tục với</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium py-2.5 rounded-xl border border-slate-200 transition-colors"
              >
                <FcGoogle className="w-4 h-4" />
                <span>Google</span>
              </button>
              <button 
                type="button"
                className="flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium py-2.5 rounded-xl border border-slate-200 transition-colors"
              >
                <FaGithub className="w-4 h-4 text-slate-900" />
                <span>GitHub</span>
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
