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

export interface FreelancerProfileResponse {
  id: number;
  userId: number;
  userEmail: string;
  fullName: string;
  title: string;
  bio: string;
  skills: string;
  hourlyRate: number;
  rating: number;
}

export interface UpdateFreelancerProfilePayload {
  fullName: string;
  title: string;
  bio: string;
  skills: string;
  hourlyRate: number;
}

