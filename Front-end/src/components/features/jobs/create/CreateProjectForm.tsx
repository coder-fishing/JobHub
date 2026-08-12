import React from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  Code2, 
  Send, 
  AlertCircle,
  Paperclip
} from 'lucide-react';
import { FormInput, FormTextarea } from '@/components/ui/FormControls';
import { SkillsInput } from '@/components/ui/SkillsInput';

export interface CreateProjectFormData {
  title: string;
  description: string;
  budget: string;
  requiredSkills: string;
  maxFreelancers: string;
  deadline: string;
}

export interface CreateProjectFormErrors {
  title?: string;
  description?: string;
  budget?: string;
  requiredSkills?: string;
  maxFreelancers?: string;
  deadline?: string;
}

interface CreateProjectFormProps {
  formData: CreateProjectFormData;
  errors: CreateProjectFormErrors;
  errorMsg: string | null;
  isSubmitting: boolean;
  titleRef?: React.Ref<HTMLInputElement>;
  descriptionRef?: React.Ref<HTMLTextAreaElement>;
  requiredSkillsRef?: React.Ref<HTMLInputElement>;
  budgetRef?: React.Ref<HTMLInputElement>;
  maxFreelancersRef?: React.Ref<HTMLInputElement>;
  deadlineRef?: React.Ref<HTMLInputElement>;
  selectedAttachment?: File | null;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSkillsChange: (newSkills: string) => void;
  onAttachmentChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateProjectForm({
  formData,
  errors,
  errorMsg,
  isSubmitting,
  titleRef,
  descriptionRef,
  requiredSkillsRef,
  budgetRef,
  maxFreelancersRef,
  deadlineRef,
  selectedAttachment,
  onChange,
  onSkillsChange,
  onAttachmentChange,
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
        error={errors.title}
        inputRef={titleRef}
      />

      {/* Description */}
      <FormTextarea
        label="Mô tả chi tiết công việc"
        name="description"
        className="resize-none"
        rows={6}
        required
        value={formData.description}
        onChange={onChange}
        placeholder="Chi tiết về các tính năng cần phát triển, yêu cầu về kiến trúc, tài liệu đính kèm..."
        error={errors.description}
        inputRef={descriptionRef}
      />

      {/* Required Skills Tag Input */}
      <SkillsInput
        label="Kỹ năng & Công nghệ yêu cầu"
        required
        icon={Code2}
        value={formData.requiredSkills}
        onChange={onSkillsChange}
        placeholder="Nhập tên kỹ năng (vd: Next.js, Java) rồi nhấn Enter..."
        error={errors.requiredSkills}
        inputRef={requiredSkillsRef}
      />

      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 space-y-3">
        <div className="flex items-center gap-2 text-slate-700">
          <Paperclip className="w-4 h-4" />
          <span className="text-xs font-semibold">Tệp đính kèm (nếu cần)</span>
        </div>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/bmp,.pdf"
          onChange={(e) => onAttachmentChange(e.target.files?.[0] ?? null)}
          className="block w-full text-xs text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-emerald-700"
        />
        <p className="text-[11px] text-slate-500">
          Chỉ hỗ trợ ảnh (PNG, JPG, JPEG, GIF, WEBP, BMP) và file PDF.
        </p>
        {selectedAttachment && (
          <p className="text-[11px] text-emerald-700 font-medium break-all">
            Đã chọn: {selectedAttachment.name}
          </p>
        )}
      </div>

      {/* Grid 3 Columns: Budget, Max Freelancers, Deadline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="Ngân sách (VNĐ)"
          type="number"
          name="budget"
          required
          min="100000"
          step="100000"
          icon={DollarSign}
          value={formData.budget}
          onChange={onChange}
          placeholder="15000000"
          className="font-semibold"
          error={errors.budget}
          inputRef={budgetRef}
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
          error={errors.maxFreelancers}
          inputRef={maxFreelancersRef}
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
          error={errors.deadline}
          inputRef={deadlineRef}
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
