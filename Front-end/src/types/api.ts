// TypeScript Interface khớp 100% với DTO Java Backend (`ProjectResponse.java`)
export interface ProjectResponse {
  id: number;
  clientId: number;
  clientEmail: string;
  title: string;
  description: string;
  budget: number;
  requiredSkills: string; // "Java, Spring Boot, React"
  maxFreelancers: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  deadline: string; // ISO Date String "YYYY-MM-DD"
  createdAt: string;
}

export interface CurrentUserResponse {
  id: number;
  email: string;
  role: 'CLIENT' | 'FREELANCER' | 'ADMIN' | 'ROLE_PENDING';
  status: string;
  profileCompleted: boolean;
  fullName?: string;
  avatarUrl?: string;
}

export interface FreelancerProfileResponse {
  id: number;
  userId: number;
  email: string;
  fullName: string;
  title: string;
  bio: string;
  skills: string;
  hourlyRate: number;
  rating: number;
  avatarUrl?: string;
  portfolioUrl?: string;
}

export interface UpdateFreelancerProfilePayload {
  fullName: string;
  title: string;
  bio: string;
  skills: string;
  hourlyRate: number;
  avatarUrl?: string;
  portfolioUrl?: string;
}

export interface ProposalResponse {
  id: number;
  projectId: number;
  projectTitle: string;
  freelancerId: number;
  freelancerName: string;
  freelancerEmail: string;
  proposalBid: number;
  coverLetter: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface MilestoneResponse {
  id: number;
  contractId: number;
  title: string;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'ESCROW_LOCKED' | 'SUBMITTED' | 'RELEASED';
}

export interface ContractResponse {
  id: number;
  projectId: number;
  projectTitle: string;
  clientId: number;
  clientEmail: string;
  freelancerId: number;
  freelancerName: string;
  freelancerEmail: string;
  totalAmount: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  milestones: MilestoneResponse[];
}

export interface ReviewPayload {
  contractId: number;
  rating: number; // 1 to 5
  comment: string;
}

export interface ReviewResponse {
  id: number;
  contractId: number;
  reviewerName: string;
  reviewerRole: 'CLIENT' | 'FREELANCER';
  rating: number;
  comment: string;
  createdAt: string;
}




