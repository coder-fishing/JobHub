import { MOCK_PROJECTS_API } from '@/constants';
import { ProjectResponse } from '@/types/api';

export interface ProposalPayload {
  projectId: string | number;
  proposalBid: string;
  coverLetter: string;
}

export const projectService = {
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
