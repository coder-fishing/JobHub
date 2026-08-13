import React, { useState } from 'react';
import { User, Upload, Loader2, Trash2 } from 'lucide-react';
import { FormInput } from '@/components/ui/FormControls';
import api from '@/lib/axios';

interface AvatarUploadPreviewProps {
  avatarUrl?: string;
  isClient?: boolean;
  onChange: (url: string) => void;
  onError?: (msg: string | null) => void;
}

export function AvatarUploadPreview({
  avatarUrl,
  isClient = false,
  onChange,
  onError,
}: AvatarUploadPreviewProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      if (onError) onError(null);

      const data = new FormData();
      data.append('file', file);

      const res = await api.post<{ url: string }>('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.url) {
        onChange(res.data.url);
      }
    } catch (err: any) {
      console.error('Lỗi khi tải ảnh lên:', err);
      if (onError) {
        onError('Tải ảnh lên thất bại. Vui lòng kiểm tra lại cấu hình upload.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700">
        {isClient ? 'Logo Công Ty (Tải Ảnh Lên & Xem Trước)' : 'Ảnh Đại Diện (Tải Ảnh Lên & Xem Trước)'}
      </label>

      <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
        {/* Avatar Preview Box (To hơn: 112px x 112px / w-28 h-28) */}
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-slate-200 border-2 border-emerald-500 shadow-md shrink-0 flex items-center justify-center group">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-slate-400" />
          )}

          {/* Loading overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs font-bold gap-1">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              <span>Đang tải...</span>
            </div>
          )}
        </div>

        {/* Upload Controls & URL Fallback */}
        <div className="space-y-3 flex-1 w-full">
          <div className="flex items-center space-x-3">
            <label className="cursor-pointer inline-flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-all shadow-xs hover:shadow-md">
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Đang Tải Lên...' : 'Chọn Ảnh Tải Lên'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>

            {avatarUrl && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center space-x-1 px-3 py-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa ảnh</span>
              </button>
            )}
          </div>

          <FormInput
            name="avatarUrl"
            value={avatarUrl || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Hoặc dán trực tiếp đường dẫn URL ảnh (https://...)"
            className="text-xs"
          />
        </div>
      </div>
    </div>
  );
}
