'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Star } from 'lucide-react';
import { ContractResponse, ReviewResponse } from '@/types/api';
import { contractService } from '@/services/contractService';
import { reviewService } from '@/services/reviewService';
import {
  ContractHeader,
  ContractReviewForm,
} from '@/components/features/contracts';

export default function ContractReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [contract, setContract] = useState<ContractResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      contractService.getContractById(id),
      reviewService.getReviewsByContractId(Number(id)),
    ]).then(([contractData, reviewData]) => {
      if (isMounted) {
        setContract(contractData);
        setReviews(reviewData);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmitReview = async (review: { rating: number; comment: string }) => {
    if (!contract) return;
    const newReview = await reviewService.submitReview({
      contractId: contract.id,
      rating: review.rating,
      comment: review.comment,
    });
    setReviews((prev) => [newReview, ...prev]);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-1/4" />
        <div className="bg-white p-8 rounded-3xl border border-slate-200 h-64" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Hợp đồng không tồn tại</h2>
        <p className="text-sm text-slate-500">Mã hợp đồng này không hợp lệ.</p>
        <Link href="/dashboard" className="inline-block bg-slate-900 text-white font-medium text-sm px-6 py-2.5 rounded-xl">
          Quay lại Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href={`/contracts/${contract.id}`}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Chi Tiết Hợp Đồng</span>
          </Link>
        </div>

        {/* Contract Header */}
        <ContractHeader contract={contract} />

        {/* Form Review */}
        <ContractReviewForm
          contractId={contract.id}
          onSubmitReview={handleSubmitReview}
        />

        {/* Existing Reviews List */}
        {reviews.length > 0 && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Các Đánh Giá Đã Gửi ({reviews.length})
            </h4>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      {rev.reviewerName}
                    </span>
                    <div className="flex items-center space-x-1 text-amber-600 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rev.rating} / 5</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rev.comment}
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
