import { ProposalResponse } from '@/types/api';
import { MOCK_PROJECTS_API } from '@/constants';

export const MOCK_PROPOSALS_API: ProposalResponse[] = [
  {
    id: 1,
    projectId: 1,
    projectTitle: 'Xây dựng Website E-commerce sử dụng Next.js & TailwindCSS',
    freelancerId: 1,
    freelancerName: 'Nguyễn Văn Minh',
    freelancerEmail: 'minh.nguyen@workhub.io',
    proposalBid: 24000000,
    coverLetter: 'Chào anh/chị, tôi có 6 năm kinh nghiệm với Next.js & React. Tôi từng làm nhiều trang E-commerce tối ưu SEO tốt. Rất mong được hợp tác!',
    status: 'PENDING',
    createdAt: '2026-08-05T09:30:00',
  },
  {
    id: 2,
    projectId: 1,
    projectTitle: 'Xây dựng Website E-commerce sử dụng Next.js & TailwindCSS',
    freelancerId: 2,
    freelancerName: 'Trần Thị Thu Hà',
    freelancerEmail: 'ha.tran@workhub.io',
    proposalBid: 25000000,
    coverLetter: 'Tôi có thể hỗ trợ cả phần thiết kế UI/UX lẫn cắt HTML/CSS responsive chuẩn đẹp bằng Next.js.',
    status: 'PENDING',
    createdAt: '2026-08-05T11:15:00',
  },
  {
    id: 3,
    projectId: 2,
    projectTitle: 'Thiết kế UI/UX App Mobile Quản lý Tài chính Cá nhân',
    freelancerId: 2,
    freelancerName: 'Trần Thị Thu Hà',
    freelancerEmail: 'ha.tran@workhub.io',
    proposalBid: 17500000,
    coverLetter: 'Đã hoàn thành 50+ app mobile UI/UX trên Figma. Tôi sẽ bàn giao đầy đủ Design System & Prototype.',
    status: 'ACCEPTED',
    createdAt: '2026-08-04T14:00:00',
  },
  {
    id: 4,
    projectId: 3,
    projectTitle: 'Lập trình Backend Spring Boot cho Hệ thống Đặt vé',
    freelancerId: 3,
    freelancerName: 'Lê Hoàng Nam',
    freelancerEmail: 'nam.le@workhub.io',
    proposalBid: 4500000,
    coverLetter: 'Chuyên gia Spring Boot & PostgreSQL. Cam kết bàn giao API có mã hóa JWT và test cẩn thận.',
    status: 'PENDING',
    createdAt: '2026-08-04T16:20:00',
  },
];

export const proposalService = {
  /**
   * Fetch proposals for client (proposals on client's projects)
   */
  async getClientProposals(): Promise<ProposalResponse[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return MOCK_PROPOSALS_API;
  },

  /**
   * Fetch proposals sent by freelancer
   */
  async getFreelancerProposals(): Promise<ProposalResponse[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    // Giả lập proposals của Freelancer ID = 1 (Nguyễn Văn Minh)
    return MOCK_PROPOSALS_API.filter((p) => p.freelancerId === 1);
  },

  /**
   * Update proposal status (Accept/Reject by Client)
   */
  async updateProposalStatus(
    proposalId: number,
    status: 'ACCEPTED' | 'REJECTED'
  ): Promise<ProposalResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const target = MOCK_PROPOSALS_API.find((p) => p.id === proposalId);
    if (target) {
      target.status = status;
      return { ...target };
    }
    throw new Error('Proposal not found');
  },
};
