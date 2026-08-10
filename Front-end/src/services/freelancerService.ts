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
   * Get current logged-in user profile
   */
  async getCurrentProfile(): Promise<FreelancerProfileResponse> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Chưa đăng nhập');

    const res = await fetch('http://localhost:8080/api/freelancer/profile/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error('Lỗi khi tải hồ sơ');
    }
    return res.json();
  },

  /**
   * Update profile
   */
  async updateProfile(
    id: number,
    payload: UpdateFreelancerProfilePayload
  ): Promise<FreelancerProfileResponse> {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Chưa đăng nhập');

    const res = await fetch('http://localhost:8080/api/freelancer/profile/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error('Cập nhật hồ sơ thất bại');
    }
    return res.json();
  },
};

