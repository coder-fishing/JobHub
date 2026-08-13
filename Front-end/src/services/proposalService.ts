import { ProposalResponse } from '@/types/api';
import { MOCK_PROJECTS_API } from '@/constants';

import { ProposalResponse } from '@/types/api';
import api from '@/lib/axios';

export const proposalService = {
  /**
   * Fetch proposals for client (proposals on client's projects)
   */
  async getClientProposals(): Promise<ProposalResponse[]> {
    const res = await api.get('/proposal/client/me');
    return res.data;
  },

  /**
   * Fetch proposals for freelancer
   */
  async getFreelancerProposals(): Promise<ProposalResponse[]> {
    const res = await api.get('/proposal/freelancer/me');
    return res.data;
  },

  /**
   * Update proposal status (Accept/Reject by Client)
   */
  async updateProposalStatus(
    proposalId: number,
    status: 'ACCEPTED' | 'REJECTED'
  ): Promise<ProposalResponse> {
    const endpoint = status === 'ACCEPTED' ? 'accept' : 'reject';
    try {
      const res = await api.post(`/proposal/${proposalId}/${endpoint}`);
      return res.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  },
};
