import { MOCK_PROJECTS_API } from '@/constants';
import { ProjectResponse } from '@/types/api';

export interface ProposalPayload {
  projectId: string | number;
  proposalBid: string;
  coverLetter: string;
}

export interface ProjectFilterParams {
  searchQuery?: string;
  statuses?: string[];
  skills?: string[];
  maxBudget?: number;
  sortBy?: 'newest' | 'budget_high' | 'budget_low';
  myProjects?: boolean; // Added for Client dashboard
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  budget: number;
  requiredSkills: string; // Not stored in backend currently, but passed
  maxFreelancers: number;
  deadline: string;
}

const API_BASE = 'http://localhost:8080/api/project';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const projectService = {
  /**
   * Fetch and filter project list
   */
  async getProjects(params?: ProjectFilterParams): Promise<ProjectResponse[]> {
    let url = API_BASE;
    
    if (params?.myProjects) {
      url += '?myProjects=true';
    } else if (params?.statuses?.includes('OPEN') && params.statuses.length === 1) {
      url += '?status=OPEN';
    }

    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Không thể lấy danh sách dự án');
    
    let result: ProjectResponse[] = await res.json();

    if (!params) return result;

    const { searchQuery, statuses, skills, maxBudget, sortBy } = params;

    result = result.filter((project) => {
      // Search Query Filter
      if (
        searchQuery &&
        !project.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !project.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Status Filter (If we didn't use the simple OPEN query above)
      if (statuses && statuses.length > 0 && !statuses.includes(project.status)) {
        return false;
      }

      // Budget Filter
      if (maxBudget !== undefined && project.budget > maxBudget) {
        return false;
      }

      // ==================== THÊM ĐOẠN NÀY ====================
      // Skills Filter
      if (skills && skills.length > 0) {
        const projectSkills = project.requiredSkills
          ? project.requiredSkills.split(',').map((s) => s.trim().toLowerCase())
          : [];

        // OR logic: project có ít nhất 1 skill trong danh sách đã chọn
        const hasMatchingSkill = skills.some((skill) =>
          projectSkills.includes(skill.toLowerCase())
        );

        if (!hasMatchingSkill) {
          return false;
        }
      }
      // ======================================================

      return true;
    });

    if (sortBy === 'budget_high') {
      result.sort((a, b) => b.budget - a.budget);
    } else if (sortBy === 'budget_low') {
      result.sort((a, b) => a.budget - b.budget);
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  },

  /**
   * Fetch project detail by ID
   */
  async getProjectById(id: string | number): Promise<ProjectResponse | null> {
    const res = await fetch(`${API_BASE}/${id}`, { headers: getAuthHeaders() });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Không thể tải chi tiết dự án');
    }
    return res.json();
  },

  /**
   * Create a new project
   */
  async createProject(payload: CreateProjectPayload, attachment?: File | null): Promise<ProjectResponse> {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('budget', String(payload.budget));
    formData.append('requiredSkills', payload.requiredSkills);
    formData.append('maxFreelancers', String(payload.maxFreelancers));
    formData.append('deadline', payload.deadline);
    if (attachment) {
      formData.append('attachment', attachment);
    }

    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi tạo dự án');
    }
    return res.json();
  },

  /**
   * Submit proposal for a project
   */
  async submitProposal(payload: ProposalPayload): Promise<{ success: boolean }> {
    // Mô phỏng delay API submit proposal
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Sending proposal for project:', payload.projectId, {
      proposalBid: payload.proposalBid,
      coverLetter: payload.coverLetter,
    });
    return { success: true };
  },
};