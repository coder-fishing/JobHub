import React, { useState } from 'react';
import { User, Briefcase, DollarSign, Code2, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { FormInput, FormTextarea } from '@/components/ui/FormControls';
import { SkillsInput } from '@/components/ui/SkillsInput';
import { AvatarUploadPreview } from './AvatarUploadPreview';

export interface ProfileFormData {
  fullName: string;
  title: string;
  bio: string;
  skills: string;
  hourlyRate: string;
  avatarUrl?: string;
  companyWebsite?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  taxCode?: string;
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
  isClient?: boolean;
}

export function ProfileEditForm({
  formData,
  isSubmitting,
  errorMsg,
  successMsg,
  onChange,
  onSkillsChange,
  onSubmit,
  isClient = false,
}: ProfileEditFormProps) {
  const [uploadError, setUploadError] = useState<string | null>(null);

  return (
    <form onSubmit={onSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
        {isClient ? 'Chỉnh Sửa Hồ Sơ Doanh Nghiệp / Công Ty' : 'Chỉnh Sửa Thông Tin Cá Nhân'}
      </h3>

      {(errorMsg || uploadError) && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg || uploadError}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-4 rounded-xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name / Company Name */}
        <FormInput
          label={isClient ? "Tên Công Ty / Doanh Nghiệp" : "Họ và Tên"}
          name="fullName"
          required
          icon={User}
          value={formData.fullName}
          onChange={onChange}
          placeholder={isClient ? "Công ty TNHH TechVision" : "Nguyễn Văn A"}
        />

        {/* Title / Industry */}
        <FormInput
          label={isClient ? "Ngành Nghề / Lĩnh Vực" : "Chức danh / Chuyên môn"}
          name={isClient ? "industry" : "title"}
          required={!isClient}
          icon={Briefcase}
          value={isClient ? (formData.industry || '') : formData.title}
          onChange={onChange}
          placeholder={isClient ? "Công Nghệ Thông Tin & Phần Mềm" : "Senior Fullstack Developer"}
        />
      </div>

      {isClient && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormInput
            label="Website Doanh Nghiệp"
            name="companyWebsite"
            value={formData.companyWebsite || ''}
            onChange={onChange}
            placeholder="https://techvision.vn"
          />
          <FormInput
            label="Quy Mô Nhân Sự"
            name="companySize"
            value={formData.companySize || ''}
            onChange={onChange}
            placeholder="10-50 nhân sự"
          />
          <FormInput
            label="Địa Chỉ Trụ Sở"
            name="location"
            value={formData.location || ''}
            onChange={onChange}
            placeholder="Quận 1, TP. Hồ Chí Minh"
          />
        </div>
      )}

      {/* Avatar / Logo Upload Component */}
      <AvatarUploadPreview
        avatarUrl={formData.avatarUrl}
        isClient={isClient}
        onChange={(url) => onChange({ target: { name: 'avatarUrl', value: url } } as any)}
        onError={(err) => setUploadError(err)}
      />

      {/* Bio */}
      <FormTextarea
        label={isClient ? "Giới thiệu Công ty & Văn hóa Tuyển dụng" : "Giới thiệu bản thân / Tiểu sử (Bio)"}
        name="bio"
        rows={4}
        required={!isClient}
        value={formData.bio}
        onChange={onChange}
        placeholder={isClient ? "Giới thiệu tổng quan về sản phẩm, quy mô dự án và môi trường làm việc..." : "Mô tả chi tiết để cộng đồng hiểu rõ hơn về bạn..."}
      />

      {!isClient && (
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
      )}

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
