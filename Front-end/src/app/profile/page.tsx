'use client';

import { useProfile } from '@/hooks/useProfile';
import {
  ProfileHeader,
  ProfileEditForm,
  ProfileSkeleton,
} from '@/components/features/profile';

export default function ProfilePage() {
  const {
    currentUser,
    formData,
    isLoading,
    isSubmitting,
    errorMsg,
    successMsg,
    handleChange,
    handleSkillsChange,
    handleSubmit,
  } = useProfile();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const isClient = currentUser?.role === 'CLIENT';

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Profile Header */}
        <ProfileHeader
          fullName={formData.fullName || currentUser?.email || 'User'}
          title={
            formData.title ||
            (isClient ? 'Khách hàng / Nhà tuyển dụng' : 'Freelancer')
          }
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
