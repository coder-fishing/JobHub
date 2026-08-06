'use client';

import { useState, useEffect } from 'react';
import { FreelancerProfileResponse } from '@/types/api';
import { freelancerService } from '@/services/freelancerService';
import {
  ProfileHeader,
  ProfileEditForm,
  ProfileFormData,
} from '@/components/features/profile';

export default function ProfilePage() {
  const [profile, setProfile] = useState<FreelancerProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    title: '',
    bio: '',
    skills: '',
    hourlyRate: '',
  });

  useEffect(() => {
    let isMounted = true;
    freelancerService.getCurrentProfile().then((data) => {
      if (isMounted && data) {
        setProfile(data);
        setFormData({
          fullName: data.fullName,
          title: data.title,
          bio: data.bio,
          skills: data.skills,
          hourlyRate: data.hourlyRate.toString(),
        });
        setIsLoading(false);
      }
    });

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

    if (!formData.fullName.trim() || !formData.title.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ Họ tên và Chức danh.');
      return;
    }

    if (Number(formData.hourlyRate) <= 0) {
      setErrorMsg('Mức giá theo giờ phải lớn hơn 0 VNĐ.');
      return;
    }

    if (!profile) return;

    try {
      setIsSubmitting(true);
      const updated = await freelancerService.updateProfile(profile.id, {
        fullName: formData.fullName.trim(),
        title: formData.title.trim(),
        bio: formData.bio.trim(),
        skills: formData.skills.trim(),
        hourlyRate: Number(formData.hourlyRate),
      });

      setProfile(updated);
      setSuccessMsg('Cập nhật hồ sơ thành công!');
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

  if (!profile) return null;

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Profile Header */}
        <ProfileHeader
          fullName={profile.fullName}
          title={profile.title}
          email={profile.userEmail}
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
        />
      </div>
    </div>
  );
}
