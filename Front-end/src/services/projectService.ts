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
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  budget: number;
  requiredSkills: string;
  maxFreelancers: number;
  deadline: string;
}

export const projectService = {
  /**
   * Fetch and filter project list
   */
  async getProjects(params?: ProjectFilterParams): Promise<ProjectResponse[]> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    let result = [...MOCK_PROJECTS_API];

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

      // Status Filter
      if (statuses && statuses.length > 0 && !statuses.includes(project.status)) {
        return false;
      }

      // Budget Filter
      if (maxBudget !== undefined && project.budget > maxBudget) {
        return false;
      }

      // Skills Filter
      if (skills && skills.length > 0) {
        const projectSkills = project.requiredSkills.split(',').map((s) => s.trim().toLowerCase());
        const hasSkillMatch = skills.some((skill) =>
          projectSkills.includes(skill.toLowerCase())
        );
        if (!hasSkillMatch) return false;
      }

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
    // Mô phỏng delay API fetch
    await new Promise((resolve) => setTimeout(resolve, 800));
    const found = MOCK_PROJECTS_API.find((p) => p.id === Number(id));
    return found || null;
  },

  /**
   * Create a new project
   */
  async createProject(payload: CreateProjectPayload): Promise<ProjectResponse> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const newProject: ProjectResponse = {
      id: Date.now(),
      clientId: 101,
      clientEmail: 'client.company@workhub.io',
      title: payload.title,
      description: payload.description,
      budget: payload.budget,
      requiredSkills: payload.requiredSkills,
      maxFreelancers: payload.maxFreelancers,
      status: 'OPEN',
      deadline: payload.deadline,
      createdAt: new Date().toISOString(),
    };
    
    // Thêm vào mock data local
    MOCK_PROJECTS_API.unshift(newProject);
    return newProject;
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


