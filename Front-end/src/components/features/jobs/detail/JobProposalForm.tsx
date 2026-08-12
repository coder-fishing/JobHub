'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

interface JobProposalFormProps {
  initialBid: string;
  hasApplied: boolean;
  onSubmit: (proposal: { proposalBid: string; estimatedDays: string; coverLetter: string }) => Promise<void>;
}

export function JobProposalForm({ initialBid, hasApplied, onSubmit }: JobProposalFormProps) {
  const [proposalBid, setProposalBid] = useState<string>(initialBid);
  const [estimatedDays, setEstimatedDays] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ proposalBid, estimatedDays, coverLetter });
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi gửi đề xuất.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
        <Send className="w-5 h-5 text-emerald-600" />
        <span>Gửi Báo Giá & Đề Xuất Chào Thầu</span>
      </h3>

      {(isSubmitted || hasApplied) ? (
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h4 className="text-base font-bold text-emerald-900">
            Báo Giá Đã Được Gửi Thành Công!
          </h4>
          <p className="text-xs text-emerald-700">
            Khách hàng sẽ xem xét đề xuất và liên hệ với bạn trong thời gian sớm nhất.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Mức giá chào thầu của bạn (VNĐ)
            </label>
            <input
              type="number"
              required
              value={proposalBid}
              onChange={(e) => setProposalBid(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Thời gian hoàn thành ước tính (Ngày)
            </label>
            <input
              type="number"
              required
              min="1"
              value={estimatedDays}
              onChange={(e) => setEstimatedDays(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Thư giới thiệu & Phương án triển khai (Cover Letter)
            </label>
            <textarea
              rows={5}
              required
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Mô tả ngắn gọn kinh nghiệm liên quan và kế hoạch bạn sẽ thực hiện dự án này..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl p-4 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full gradient-button text-white font-semibold text-sm py-3.5 rounded-xl shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Đang gửi...' : 'Gửi Đề Xuất Chào Thầu'}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}
