import { ReviewPayload, ReviewResponse } from '@/types/api';

export const MOCK_REVIEWS_API: ReviewResponse[] = [
  {
    id: 1,
    contractId: 1001,
    reviewerName: 'TechCorp Client',
    reviewerRole: 'CLIENT',
    rating: 5,
    comment: 'Freelancer làm việc rất chuyên nghiệp, đúng tiến độ và hỗ trợ nhiệt tình. Sẽ tiếp tục hợp tác các dự án sau!',
    createdAt: '2026-08-06T12:00:00',
  },
];

export const reviewService = {
  /**
   * Submit a new review for a contract
   */
  async submitReview(payload: ReviewPayload): Promise<ReviewResponse> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newReview: ReviewResponse = {
      id: Date.now(),
      contractId: payload.contractId,
      reviewerName: 'Doanh Nghiệp Đánh Giá',
      reviewerRole: 'CLIENT',
      rating: payload.rating,
      comment: payload.comment,
      createdAt: new Date().toISOString(),
    };
    MOCK_REVIEWS_API.unshift(newReview);
    return newReview;
  },

  /**
   * Get reviews by contract ID
   */
  async getReviewsByContractId(contractId: number): Promise<ReviewResponse[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_REVIEWS_API.filter((r) => r.contractId === contractId);
  },
};
