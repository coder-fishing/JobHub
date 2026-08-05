'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectService } from '@/services/projectService';
import {
  CreateProjectHeader,
  CreateProjectForm,
  CreateProjectSuccess,
  CreateProjectFormData,
} from '@/components/features/jobs/create';

export default function CreateProjectPage() {
  const router = useRouter();

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

    // Basic Validation
    if (!formData.title.trim() || !formData.description.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ tiêu đề và mô tả dự án.');
      return;
    }

    if (Number(formData.budget) <= 0) {
      setErrorMsg('Ngân sách dự án phải lớn hơn 0 VNĐ.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (!formData.deadline) {
      setErrorMsg('Vui lòng chọn hạn chót chào thầu.');
      return;
    }
    if (formData.deadline < todayStr) {
      setErrorMsg('Hạn chót chào thầu phải là một ngày trong tương lai.');
      return;
    }

    try {
      setIsSubmitting(true);
      await projectService.createProject({
        title: formData.title.trim(),
        description: formData.description.trim(),
        budget: Number(formData.budget),
        requiredSkills: formData.requiredSkills.trim(),
        maxFreelancers: Number(formData.maxFreelancers),
        deadline: formData.deadline,
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/jobs');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Có lỗi xảy ra khi tạo dự án. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              errorMsg={errorMsg}
              isSubmitting={isSubmitting}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          )}
        </div>

      </div>
    </div>
  );
}
