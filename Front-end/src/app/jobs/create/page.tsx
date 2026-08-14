'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectService } from '@/services/projectService';
import {
  CreateProjectHeader,
  CreateProjectForm,
  CreateProjectSuccess,
  CreateProjectFormData,
  CreateProjectFormErrors,
} from '@/components/features/jobs/create';

export default function CreateProjectPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const requiredSkillsRef = useRef<HTMLInputElement>(null);
  const budgetRef = useRef<HTMLInputElement>(null);
  const maxFreelancersRef = useRef<HTMLInputElement>(null);
  const deadlineRef = useRef<HTMLInputElement>(null);

  const focusFirstErrorField = (errors: CreateProjectFormErrors) => {
    const fieldOrder: Array<keyof CreateProjectFormErrors> = [
      'title',
      'description',
      'requiredSkills',
      'budget',
      'maxFreelancers',
      'deadline',
    ];

    const fieldRefMap: Record<keyof CreateProjectFormErrors, React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>> = {
      title: titleRef,
      description: descriptionRef,
      requiredSkills: requiredSkillsRef,
      budget: budgetRef,
      maxFreelancers: maxFreelancersRef,
      deadline: deadlineRef,
    };

    const firstErrorField = fieldOrder.find((field) => errors[field]);
    if (!firstErrorField) return;

    const target = fieldRefMap[firstErrorField].current;
    if (!target) return;

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.focus({ preventScroll: true });
    });
  };

  // Auth Guard
  require('react').useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const res = await fetch('http://localhost:8080/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.role !== 'CLIENT') {
          router.push('/dashboard');
        } else {
          setIsCheckingAuth(false);
        }
      } catch {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const [formData, setFormData] = useState<CreateProjectFormData>({
    title: '',
    description: '',
    budget: '',
    requiredSkills: '',
    maxFreelancers: '1',
    deadline: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<CreateProjectFormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const nextErrors: CreateProjectFormErrors = {};
    const todayStr = new Date().toISOString().split('T')[0];

    if (!formData.title.trim()) {
      nextErrors.title = 'Vui lòng nhập tiêu đề dự án.';
    } else if (!formData.description.trim()) {
      nextErrors.description = 'Vui lòng nhập mô tả dự án.';
    } else if (!formData.requiredSkills.trim()) {
      nextErrors.requiredSkills = 'Vui lòng nhập ít nhất một kỹ năng yêu cầu.';
    } else if (!formData.budget.trim()) {
      nextErrors.budget = 'Vui lòng nhập ngân sách dự án.';
    } else if (Number(formData.budget) <= 0) {
      nextErrors.budget = 'Ngân sách dự án phải lớn hơn 0 VNĐ.';
    } else if (!formData.maxFreelancers.trim()) {
      nextErrors.maxFreelancers = 'Vui lòng nhập số lượng freelancer.';
    } else if (Number(formData.maxFreelancers) <= 0) {
      nextErrors.maxFreelancers = 'Số lượng freelancer phải lớn hơn 0.';
    } else if (!formData.deadline) {
      nextErrors.deadline = 'Vui lòng chọn hạn chót chào thầu.';
    } else if (formData.deadline < todayStr) {
      nextErrors.deadline = 'Hạn chót chào thầu phải là một ngày trong tương lai.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusFirstErrorField(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});
      await projectService.createProject({
        title: formData.title.trim(),
        description: formData.description.trim(),
        budget: Number(formData.budget),
        requiredSkills: formData.requiredSkills.trim(),
        maxFreelancers: Number(formData.maxFreelancers),
        deadline: formData.deadline,
      }, selectedAttachment);

      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        router.push('/jobs');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Có lỗi xảy ra khi tạo dự án. Vui lòng thử lại!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkillsChange = (newSkills: string) => {
    setFormData((prev) => ({ ...prev, requiredSkills: newSkills }));
  };

  const handleAttachmentChange = (file: File | null) => {
    setSelectedAttachment(file);
  };

  if (isCheckingAuth) {
    return (
      <div className="bg-slate-50 min-h-screen py-10 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <CreateProjectHeader />

        {/* Main Form Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          {isSuccess ? (
            <CreateProjectSuccess />
          ) : (
            <CreateProjectForm
              formData={formData}
              errors={errors}
              errorMsg={errorMsg}
              isSubmitting={isSubmitting}
              onChange={handleChange}
              onSkillsChange={handleSkillsChange}
              onAttachmentChange={handleAttachmentChange}
              onSubmit={handleSubmit}
                titleRef={titleRef}
                descriptionRef={descriptionRef}
                requiredSkillsRef={requiredSkillsRef}
                budgetRef={budgetRef}
                maxFreelancersRef={maxFreelancersRef}
                deadlineRef={deadlineRef}
                selectedAttachment={selectedAttachment}
            />
          )}
        </div>

      </div>
    </div>
  );
}
