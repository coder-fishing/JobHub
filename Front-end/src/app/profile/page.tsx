'use client';

import { useState, useEffect } from 'react';
import { CurrentUserResponse, FreelancerProfileResponse } from '@/types/api';
import { freelancerService } from '@/services/freelancerService';
import {
  ProfileHeader,
  ProfileEditForm,
  ProfileFormData,
} from '@/components/features/profile';

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<CurrentUserResponse | null>(null);
  const [freelancerProfile, setFreelancerProfile] = useState<FreelancerProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    title: '',
    bio: '',
    skills: '',
    hourlyRate: '0',
    avatarUrl: '',
  });

  useEffect(() => {
    let isMounted = true;

    const loadProfileData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        // Fetch current user
        const meRes = await fetch('http://localhost:8080/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!meRes.ok) {
          throw new Error('Lỗi xác thực thông tin người dùng.');
        }

        const meData: CurrentUserResponse = await meRes.json();
        if (!isMounted) return;
        setCurrentUser(meData);

        // Populate baseline data from auth/me / localStorage
        const storedFullName = meData.fullName || localStorage.getItem('user_fullname') || '';
        const storedAvatar = meData.avatarUrl || localStorage.getItem('user_avatar') || '';

        if (meData.role === 'FREELANCER') {
          try {
            const fProfile = await freelancerService.getCurrentProfile();
            if (isMounted && fProfile) {
              setFreelancerProfile(fProfile);
              setFormData({
                fullName: fProfile.fullName || storedFullName,
                title: fProfile.title || '',
                bio: fProfile.bio || '',
                skills: fProfile.skills || '',
                hourlyRate: fProfile.hourlyRate ? fProfile.hourlyRate.toString() : '0',
                avatarUrl: fProfile.avatarUrl || storedAvatar,
              });
            }
          } catch (e) {
            // New Freelancer without profile yet
            if (isMounted) {
              setFormData({
                fullName: storedFullName,
                title: '',
                bio: '',
                skills: '',
                hourlyRate: '0',
                avatarUrl: storedAvatar,
              });
            }
          }
        } else {
          // Client or other roles
          if (isMounted) {
            setFormData({
              fullName: storedFullName || meData.email,
              title: localStorage.getItem('client_company') || '',
              bio: localStorage.getItem('client_bio') || '',
              skills: '',
              hourlyRate: '0',
              avatarUrl: storedAvatar,
            });
          }
        }
      } catch (err: any) {
        if (isMounted) setErrorMsg(err?.message || 'Không thể tải thông tin trang cá nhân.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!formData.fullName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và Tên.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (currentUser?.role === 'FREELANCER') {
        const updated = await freelancerService.updateProfile(freelancerProfile?.id || 0, {
          fullName: formData.fullName.trim(),
          title: formData.title.trim(),
          bio: formData.bio.trim(),
          skills: formData.skills.trim(),
          hourlyRate: Number(formData.hourlyRate) || 0,
          avatarUrl: formData.avatarUrl?.trim() || '',
        });

        setFreelancerProfile(updated);
        if (updated.fullName) localStorage.setItem('user_fullname', updated.fullName);
        if (updated.avatarUrl) localStorage.setItem('user_avatar', updated.avatarUrl);
      } else {
        // CLIENT Profile update mock/local handling
        localStorage.setItem('user_fullname', formData.fullName.trim());
        if (formData.avatarUrl) localStorage.setItem('user_avatar', formData.avatarUrl.trim());
        if (formData.title) localStorage.setItem('client_company', formData.title.trim());
        if (formData.bio) localStorage.setItem('client_bio', formData.bio.trim());
      }

      setSuccessMsg('Cập nhật hồ sơ thành công!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkillsChange = (newSkills: string) => {
    setFormData((prev) => ({ ...prev, skills: newSkills }));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 h-32" />
        <div className="bg-white p-8 rounded-3xl border border-slate-200 h-96" />
      </div>
    );
  }

  const isClient = currentUser?.role === 'CLIENT';

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Profile Header */}
        <ProfileHeader
          fullName={formData.fullName || currentUser?.email || 'User'}
          title={formData.title || (isClient ? 'Khách hàng / Nhà tuyển dụng' : 'Freelancer')}
          email={currentUser?.email || ''}
          avatarUrl={formData.avatarUrl}
          role={currentUser?.role}
        />

        {/* Profile Edit Form */}
        <ProfileEditForm
          formData={formData}
          isSubmitting={isSubmitting}
          errorMsg={errorMsg}
          successMsg={successMsg}
          onChange={handleChange}
          onSkillsChange={handleSkillsChange}
          onSubmit={handleSubmit}
          isClient={isClient}
        />
      </div>
    </div>
  );
}
