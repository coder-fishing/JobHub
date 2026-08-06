import React from 'react';
import { User, Briefcase, DollarSign, Code2, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { FormInput, FormTextarea } from '@/components/ui/FormControls';
import { SkillsInput } from '@/components/ui/SkillsInput';

export interface ProfileFormData {
  fullName: string;
  title: string;
  bio: string;
  skills: string;
  hourlyRate: string;
}

interface ProfileEditFormProps {
  formData: ProfileFormData;
  isSubmitting: boolean;
  errorMsg: string | null;
  successMsg: string | null;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSkillsChange: (newSkills: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProfileEditForm({
  formData,
  isSubmitting,
  errorMsg,
  successMsg,
  onChange,
  onSkillsChange,
  onSubmit,
}: ProfileEditFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
        Chỉnh Sửa Thông Tin Cá Nhân
      </h3>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-4 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <FormInput
          label="Họ và Tên"
          name="fullName"
          required
          icon={User}
          value={formData.fullName}
          onChange={onChange}
          placeholder="Nguyễn Văn A"
        />

        {/* Title */}
        <FormInput
          label="Chức danh / Chuyên môn"
          name="title"
          required
          icon={Briefcase}
          value={formData.title}
          onChange={onChange}
          placeholder="Senior Fullstack Developer"
        />
      </div>

      {/* Bio */}
      <FormTextarea
        label="Giới thiệu bản thân / Tiểu sử (Bio)"
        name="bio"
        rows={5}
        required
        value={formData.bio}
        onChange={onChange}
        placeholder="Mô tả kinh nghiệm, số năm làm việc, các thế mạnh dự án..."
      />

      <div className="space-y-4">
        {/* Skills Tag Input */}
        <SkillsInput
          label="Kỹ năng & Công nghệ"
          icon={Code2}
          value={formData.skills}
          onChange={onSkillsChange}
          placeholder="Nhập tên kỹ năng (vd: Next.js, Java) rồi nhấn Enter..."
        />

        {/* Hourly Rate */}
        <FormInput
          label="Mức giá theo giờ (VNĐ/h)"
          type="number"
          name="hourlyRate"
          required
          min="50000"
          step="50000"
          icon={DollarSign}
          value={formData.hourlyRate}
          onChange={onChange}
          placeholder="350000"
          className="font-semibold text-emerald-600"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-xs font-semibold hover:opacity-95 transition-opacity shadow-md flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Đang Lưu Bổ Sung...' : 'Lưu Thay Đổi'}</span>
        </button>
      </div>
    </form>
  );
}
