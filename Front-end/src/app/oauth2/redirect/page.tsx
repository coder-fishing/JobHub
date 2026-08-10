'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles } from 'lucide-react';

function RedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      setErrorMsg(`Xác thực thất bại: ${error}`);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      return;
    }

    if (token) {
      localStorage.setItem('token', token);
      
      // Fetch /api/auth/me instead of manual decoding
      fetch('http://localhost:8080/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Token không hợp lệ');
          return res.json();
        })
        .then(meData => {
          localStorage.setItem('user_role', meData.role);
          
          if (meData.role === 'FREELANCER' && !meData.profileCompleted) {
            router.push('/profile/complete');
          } else {
            router.push('/dashboard');
          }
        })
        .catch(err => {
          console.error("Failed to fetch me", err);
          setErrorMsg('Lỗi xác thực thông tin người dùng.');
          setTimeout(() => router.push('/login'), 3000);
        });
    } else {
      setErrorMsg('Không tìm thấy token. Đang quay lại trang đăng nhập...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  }, [router, searchParams]);

  return (
    <div className="w-full max-w-md space-y-8 relative z-10 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center">
      {errorMsg ? (
         <div className="text-red-600 space-y-4">
           <div className="text-xl font-bold">Lỗi Xác Thực</div>
           <p className="text-sm">{errorMsg}</p>
         </div>
      ) : (
        <div className="space-y-4 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Đang hoàn tất đăng nhập...</h2>
          <p className="text-sm text-slate-500">Vui lòng chờ trong giây lát.</p>
        </div>
      )}
    </div>
  );
}

export default function OAuth2RedirectPage() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/5 blur-[130px] rounded-full pointer-events-none" />
      <Suspense fallback={
        <div className="w-full max-w-md space-y-8 relative z-10 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center">
          <p className="text-slate-500">Đang tải...</p>
        </div>
      }>
        <RedirectContent />
      </Suspense>
    </div>
  );
}
