'use client';

import React from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  Code2, 
  Send, 
  AlertCircle 
} from 'lucide-react';
import { FormInput, FormTextarea } from '@/components/Form/FormControls';

export interface CreateProjectFormData {
  title: string;
  description: string;
  budget: string;
  requiredSkills: string;
  maxFreelancers: string;
  deadline: string;
}

interface CreateProjectFormProps {
  formData: CreateProjectFormData;
  errorMsg: string | null;
  isSubmitting: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateProjectForm({
  formData,
  errorMsg,
  isSubmitting,
  onChange,
  onSubmit,
}: CreateProjectFormProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Title */}
      <FormInput
        label="Tiêu đề dự án"
        name="title"
        required
        value={formData.title}
        onChange={onChange}
        placeholder="Ví dụ: Xây dựng Website Bán Hàng E-commerce bằng Next.js & Spring Boot"
      />

      {/* Description */}
      <FormTextarea
        label="Mô tả chi tiết công việc"
        name="description"
        rows={6}
        required
        value={formData.description}
        onChange={onChange}
        placeholder="Chi tiết về các tính năng cần phát triển, yêu cầu về kiến trúc, tài liệu đính kèm..."
      />

      {/* Required Skills */}
      <FormInput
        label="Kỹ năng & Công nghệ yêu cầu"
        name="requiredSkills"
        icon={Code2}
        value={formData.requiredSkills}
        onChange={onChange}
        placeholder="Phân cách bằng dấu phẩy. Ví dụ: React, TypeScript, Node.js, TailwindCSS"
      />

      {/* Grid 3 Columns: Budget, Max Freelancers, Deadline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="Ngân sách (VNĐ)"
          type="number"
          name="budget"
          required
          min="100000"
          step="500000"
          icon={DollarSign}
          value={formData.budget}
          onChange={onChange}
          placeholder="15000000"
          className="font-semibold"
        />

        <FormInput
          label="Số lượng Freelancer"
          type="number"
          name="maxFreelancers"
          required
          min="1"
          max="10"
          icon={Users}
          value={formData.maxFreelancers}
          onChange={onChange}
          className="font-semibold"
        />

        <FormInput
          label="Hạn chót chào thầu"
          type="date"
          name="deadline"
          required
          min={todayStr}
          icon={Calendar}
          value={formData.deadline}
          onChange={onChange}
          className="font-semibold"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
        <Link
          href="/jobs"
          className="px-6 py-3 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
        >
          Hủy bỏ
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-xs font-semibold hover:opacity-95 transition-opacity shadow-md flex items-center space-x-2 disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Đang Đăng Dự Án...' : 'Đăng Dự Án Ngay'}</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
