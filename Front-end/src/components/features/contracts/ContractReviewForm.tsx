'use client';

import React, { useState } from 'react';
import { Star, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { FormTextarea } from '@/components/ui/FormControls';

interface ContractReviewFormProps {
  contractId: number;
  onSubmitReview: (review: { rating: number; comment: string }) => Promise<void>;
}

export function ContractReviewForm({
  contractId,
  onSubmitReview,
}: ContractReviewFormProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!comment.trim()) {
      setErrorMsg('Vui lòng nhập lời nhận xét của bạn.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmitReview({ rating, comment: comment.trim() });
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Có lỗi xảy ra khi gửi đánh giá.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h3 className="text-lg font-bold text-emerald-900">
          Đã Gửi Đánh Giá Thành Công!
        </h3>
        <p className="text-xs text-emerald-700">
          Cảm ơn bạn đã đóng góp ý kiến. Đánh giá của bạn sẽ giúp xây dựng cộng đồng WorkHub uy tín hơn.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-lg font-bold text-slate-900">
          Đánh Giá & Nhận Xét Hợp Đồng
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Đánh giá chất lượng làm việc của đối tác sau khi hoàn thành dự án
        </p>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Interactive Star Rating */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Mức độ hài lòng <span className="text-rose-500">*</span>
        </label>
        
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  (hoverRating || rating) >= star
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300'
                } transition-colors`}
              />
            </button>
          ))}
          <span className="text-sm font-bold text-slate-800 pl-2">
            {hoverRating || rating} / 5 Sao
          </span>
        </div>
      </div>

      {/* Review Comment */}
      <FormTextarea
        label="Lời nhận xét & Góp ý"
        rows={4}
        required
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Chia sẻ về thái độ làm việc, tiến độ bàn giao, chất lượng sản phẩm..."
      />

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-xs font-semibold hover:opacity-95 transition-opacity shadow-md flex items-center space-x-2 disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Đang Gửi Đánh Giá...' : 'Gửi Đánh Giá Ngay'}</span>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
