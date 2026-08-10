'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, User, Briefcase, FileText, DollarSign, Wrench, Link as LinkIcon } from 'lucide-react';

export default function ProfileCompletePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    bio: '',
    hourlyRate: 0,
    skills: '',
    portfolioUrl: ''
  });

  useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // 1. Check Auth via /api/auth/me
        const meRes = await fetch('http://localhost:8080/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!meRes.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('user_role');
          router.push('/login');
          return;
        }

        const meData = await meRes.json();

        // Rules check
        if (meData.role === 'CLIENT' || (meData.role === 'FREELANCER' && meData.profileCompleted)) {
          router.push('/dashboard');
          return;
        }

        // 2. If valid and incomplete, fetch existing profile data
        const profileRes = await fetch('http://localhost:8080/api/freelancer/profile/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (profileRes.ok) {
          const data = await profileRes.json();
          setFormData({
            fullName: data.fullName || '',
            title: data.title || '',
            bio: data.bio || '',
            hourlyRate: data.hourlyRate || 0,
            skills: data.skills || '',
            portfolioUrl: data.portfolioUrl || ''
          });
        }
      } catch (err) {
        console.error('Lỗi khi kiểm tra xác thực hoặc tải hồ sơ:', err);
      }
    };
    
    checkAuthAndFetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hourlyRate' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Phiên đăng nhập đã hết hạn.');

      // 1. Update Profile
      const updateRes = await fetch('http://localhost:8080/api/freelancer/profile/me', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!updateRes.ok) {
        throw new Error('Cập nhật hồ sơ thất bại. Vui lòng thử lại.');
      }

      // 2. Refresh Auth Status
      const meRes = await fetch('http://localhost:8080/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!meRes.ok) throw new Error('Lỗi đồng bộ hồ sơ.');
      const meData = await meRes.json();
      
      if (meData.profileCompleted) {
        router.push('/dashboard');
      } else {
        throw new Error('Hồ sơ vẫn chưa hoàn thiện, vui lòng điền đủ các trường bắt buộc.');
      }

    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[500px] bg-emerald-500/5 blur-[130px] rounded-full pointer-events-none" />
      
      <div className="max-w-2xl mx-auto space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bước cuối cùng</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hoàn thiện hồ sơ Freelancer</h1>
          <p className="text-sm text-slate-500">
            Hãy cho khách hàng biết thêm về bạn để bắt đầu nhận dự án.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text" name="fullName" required value={formData.fullName} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Chức danh <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="VD: Fullstack Developer"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Mức lương theo giờ ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number" name="hourlyRate" min="0" required value={formData.hourlyRate} onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                  <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Kỹ năng (Cách nhau bằng dấu phẩy) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text" name="skills" required value={formData.skills} onChange={handleChange} placeholder="React, Node.js, ..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  />
                  <Wrench className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Link Portfolio / CV (Không bắt buộc)
              </label>
              <div className="relative">
                <input
                  type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Giới thiệu bản thân <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  name="bio" required rows={4} value={formData.bio} onChange={handleChange} placeholder="Hãy giới thiệu ngắn gọn về kinh nghiệm của bạn..."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all resize-none"
                />
                <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-200 text-center">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-button text-white font-semibold text-sm py-4 rounded-xl shadow-md flex items-center justify-center space-x-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Đang lưu...' : 'Hoàn Tất Hồ Sơ'}</span>
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
