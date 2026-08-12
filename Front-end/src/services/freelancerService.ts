import api from '@/lib/axios';
import { AxiosError } from 'axios';
import {
  FreelancerProfileResponse,
  UpdateFreelancerProfilePayload,
} from '@/types/api';

export interface FreelancerFilterParams {
  searchQuery?: string;
  skills?: string[];
  maxHourlyRate?: number;
  minRating?: number;
  sortBy?: 'rating_high' | 'rate_low' | 'rate_high';
}

export const freelancerService = {
  /**
   * Get freelancers
   */
  async getFreelancers(
    params?: FreelancerFilterParams
  ): Promise<FreelancerProfileResponse[]> {
    try {
      const response = await api.get<FreelancerProfileResponse[]>(
        '/freelancer/profile',
        {
          params: {
            search: params?.searchQuery,
          },
        }
      );
      if (response.data) {
        let result = response.data;
        if (params?.maxHourlyRate !== undefined) {
          result = result.filter(f => f.hourlyRate <= params.maxHourlyRate!);
        }
        if (params?.sortBy === 'rate_high') {
          result.sort((a, b) => b.hourlyRate - a.hourlyRate);
        } else if (params?.sortBy === 'rate_low') {
          result.sort((a, b) => a.hourlyRate - b.hourlyRate);
        }
        return result;
      }
      return [];
    } catch (error) {
      console.error('Error fetching freelancers list:', error);
      return [];
    }
  },

  /**
   * Get freelancer by ID
   */
  async getFreelancerById(
    id: string | number
  ): Promise<FreelancerProfileResponse | null> {
    try {
      const response = await api.get<FreelancerProfileResponse>(
        `/freelancer/profile/${id}`
      );

      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null;
      }

      return null;
    }
  },

  /**
   * Get current logged-in freelancer profile
   */
  async getCurrentProfile(): Promise<FreelancerProfileResponse> {
    const response = await api.get<FreelancerProfileResponse>(
      '/freelancer/profile/me'
    );

    return response.data;
  },

  /**
   * Update freelancer profile
   */
  async updateProfile(
    id: number,
    payload: UpdateFreelancerProfilePayload
  ): Promise<FreelancerProfileResponse> {
    const response = await api.put<FreelancerProfileResponse>(
      '/freelancer/profile/me',
      payload
    );

    return response.data;
  },
};