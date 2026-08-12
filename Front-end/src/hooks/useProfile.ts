import { useState, useEffect } from 'react';
import { CurrentUserResponse, FreelancerProfileResponse } from '@/types/api';
import { freelancerService } from '@/services/freelancerService';
import { clientService } from '@/services/clientService';
import { ProfileFormData } from '@/components/features/profile';

export function useProfile() {
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
          // Client profile load via clientService
          try {
            const cProfile = await clientService.getMyProfile();
            if (isMounted && cProfile) {
              setFormData({
                fullName: cProfile.companyName || storedFullName,
                title: cProfile.industry || '',
                bio: cProfile.bio || '',
                skills: '',
                hourlyRate: '0',
                avatarUrl: cProfile.avatarUrl || storedAvatar,
                companyWebsite: cProfile.companyWebsite || '',
                industry: cProfile.industry || '',
                companySize: cProfile.companySize || '',
                location: cProfile.location || '',
                taxCode: cProfile.taxCode || '',
              });
            }
          } catch (e) {
            if (isMounted) {
              setFormData({
                fullName: storedFullName || meData.email,
                title: '',
                bio: '',
                skills: '',
                hourlyRate: '0',
                avatarUrl: storedAvatar,
              });
            }
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

  const handleSkillsChange = (newSkills: string) => {
    setFormData((prev) => ({ ...prev, skills: newSkills }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!formData.fullName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và Tên / Tên công ty.');
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
        // CLIENT Profile update via API
        const updatedClient = await clientService.updateMyProfile({
          companyName: formData.fullName.trim(),
          companyWebsite: formData.companyWebsite?.trim(),
          industry: formData.industry?.trim(),
          companySize: formData.companySize?.trim(),
          bio: formData.bio?.trim(),
          location: formData.location?.trim(),
          avatarUrl: formData.avatarUrl?.trim(),
          taxCode: formData.taxCode?.trim(),
        });

        if (updatedClient.companyName) localStorage.setItem('user_fullname', updatedClient.companyName);
        if (updatedClient.avatarUrl) localStorage.setItem('user_avatar', updatedClient.avatarUrl);
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

  return {
    currentUser,
    freelancerProfile,
    formData,
    isLoading,
    isSubmitting,
    errorMsg,
    successMsg,
    handleChange,
    handleSkillsChange,
    handleSubmit,
  };
}
