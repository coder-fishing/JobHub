import { ContractResponse, MilestoneResponse } from '@/types/api';

export const MOCK_CONTRACTS_API: ContractResponse[] = [
  {
    id: 1001,
    projectId: 1,
    projectTitle: 'Xây dựng Website E-commerce sử dụng Next.js & TailwindCSS',
    clientId: 101,
    clientEmail: 'client.techcorp@gmail.com',
    freelancerId: 1,
    freelancerName: 'Nguyễn Văn Minh',
    freelancerEmail: 'minh.nguyen@workhub.io',
    totalAmount: 24000000,
    status: 'ACTIVE',
    createdAt: '2026-08-05T10:00:00',
    milestones: [
      {
        id: 1,
        contractId: 1001,
        title: 'Giai đoạn 1: Thiết kế Wireframe & Khung giao diện Next.js',
        amount: 8000000,
        dueDate: '2026-08-20',
        status: 'RELEASED',
      },
      {
        id: 2,
        contractId: 1001,
        title: 'Giai đoạn 2: Lập trình chức năng Giỏ hàng, Đặt hàng & RESTful API',
        amount: 10000000,
        dueDate: '2026-09-01',
        status: 'ESCROW_LOCKED',
      },
      {
        id: 3,
        contractId: 1001,
        title: 'Giai đoạn 3: Kiểm thử, Tối ưu SEO & Bàn giao hệ thống',
        amount: 6000000,
        dueDate: '2026-09-15',
        status: 'PENDING',
      },
    ],
  },
  {
    id: 1002,
    projectId: 2,
    projectTitle: 'Thiết kế UI/UX App Mobile Quản lý Tài chính Cá nhân',
    clientId: 102,
    clientEmail: 'startup.fintech@gmail.com',
    freelancerId: 2,
    freelancerName: 'Trần Thị Thu Hà',
    freelancerEmail: 'ha.tran@workhub.io',
    totalAmount: 17500000,
    status: 'ACTIVE',
    createdAt: '2026-08-04T15:00:00',
    milestones: [
      {
        id: 4,
        contractId: 1002,
        title: 'Giai đoạn 1: User Research & Figma Wireframe Prototype',
        amount: 8500000,
        dueDate: '2026-08-15',
        status: 'SUBMITTED',
      },
      {
        id: 5,
        contractId: 1002,
        title: 'Giai đoạn 2: Thiết kế Design System & Bàn giao UI Kit',
        amount: 9000000,
        dueDate: '2026-08-30',
        status: 'ESCROW_LOCKED',
      },
    ],
  },
];

export const contractService = {
  /**
   * Fetch contract details by ID
   */
  async getContractById(id: string | number): Promise<ContractResponse | null> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const found = MOCK_CONTRACTS_API.find((c) => c.id === Number(id));
    return found || null;
  },

  /**
   * Fetch all contracts for user
   */
  async getUserContracts(): Promise<ContractResponse[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return MOCK_CONTRACTS_API;
  },

  /**
   * Action 1: Client deposit money into Escrow for a milestone
   */
  async lockMilestoneEscrow(contractId: number, milestoneId: number): Promise<ContractResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const contract = MOCK_CONTRACTS_API.find((c) => c.id === contractId);
    if (contract) {
      const ms = contract.milestones.find((m) => m.id === milestoneId);
      if (ms) ms.status = 'ESCROW_LOCKED';
      return { ...contract };
    }
    throw new Error('Contract or Milestone not found');
  },

  /**
   * Action 2: Freelancer submit work for a milestone
   */
  async submitMilestoneWork(contractId: number, milestoneId: number): Promise<ContractResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const contract = MOCK_CONTRACTS_API.find((c) => c.id === contractId);
    if (contract) {
      const ms = contract.milestones.find((m) => m.id === milestoneId);
      if (ms) ms.status = 'SUBMITTED';
      return { ...contract };
    }
    throw new Error('Contract or Milestone not found');
  },

  /**
   * Action 3: Client release funds for a milestone
   */
  async releaseMilestoneFunds(contractId: number, milestoneId: number): Promise<ContractResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const contract = MOCK_CONTRACTS_API.find((c) => c.id === contractId);
    if (contract) {
      const ms = contract.milestones.find((m) => m.id === milestoneId);
      if (ms) ms.status = 'RELEASED';
      return { ...contract };
    }
    throw new Error('Contract or Milestone not found');
  },
};
