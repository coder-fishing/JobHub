import { MOCK_FREELANCERS_API } from '@/constants';
import { FreelancerProfileResponse, UpdateFreelancerProfilePayload } from '@/types/api';

export interface FreelancerFilterParams {
  searchQuery?: string;
  skills?: string[];
  maxHourlyRate?: number;
  minRating?: number;
  sortBy?: 'rating_high' | 'rate_low' | 'rate_high';
}

export const freelancerService = {
  /**
   * Fetch and filter freelancers list
   */
  async getFreelancers(params?: FreelancerFilterParams): Promise<FreelancerProfileResponse[]> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    let result = [...MOCK_FREELANCERS_API];

    if (!params) return result;

    const { searchQuery, skills, maxHourlyRate, minRating, sortBy } = params;

    result = result.filter((freelancer) => {
      // Search Query Filter
      if (
        searchQuery &&
        !freelancer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !freelancer.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !freelancer.bio.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Hourly Rate Filter
      if (maxHourlyRate !== undefined && freelancer.hourlyRate > maxHourlyRate) {
        return false;
      }

      // Rating Filter
      if (minRating !== undefined && freelancer.rating < minRating) {
        return false;
      }

      // Skills Filter
      if (skills && skills.length > 0) {
        const freelancerSkills = freelancer.skills.split(',').map((s) => s.trim().toLowerCase());
        const hasSkillMatch = skills.some((skill) =>
          freelancerSkills.includes(skill.toLowerCase())
        );
        if (!hasSkillMatch) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'rate_high') {
      result.sort((a, b) => b.hourlyRate - a.hourlyRate);
    } else if (sortBy === 'rate_low') {
      result.sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else {
      // Rating High
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  },

  /**
   * Fetch freelancer profile by ID
   */
  async getFreelancerById(id: string | number): Promise<FreelancerProfileResponse | null> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const found = MOCK_FREELANCERS_API.find((f) => f.id === Number(id));
    return found || null;
  },

  /**
   * Get current logged-in user profile (Mock profile)
   */
  async getCurrentProfile(): Promise<FreelancerProfileResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_FREELANCERS_API[0];
  },

  /**
   * Update profile
   */
  async updateProfile(
    id: number,
    payload: UpdateFreelancerProfilePayload
  ): Promise<FreelancerProfileResponse> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const targetIndex = MOCK_FREELANCERS_API.findIndex((f) => f.id === id);
    
    if (targetIndex !== -1) {
      MOCK_FREELANCERS_API[targetIndex] = {
        ...MOCK_FREELANCERS_API[targetIndex],
        fullName: payload.fullName,
        title: payload.title,
        bio: payload.bio,
        skills: payload.skills,
        hourlyRate: payload.hourlyRate,
      };
      return MOCK_FREELANCERS_API[targetIndex];
    }

    throw new Error('Profile not found');
  },
};

