'use client';

import { useState, useEffect, useCallback } from 'react';
import { FreelancerProfileResponse } from '@/types/api';
import { freelancerService, FreelancerFilterParams } from '@/services/freelancerService';

export function useFreelancers(initialParams?: FreelancerFilterParams) {
  const [freelancers, setFreelancers] = useState<FreelancerProfileResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState(initialParams?.searchQuery || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialParams?.skills || []);
  const [maxHourlyRate, setMaxHourlyRate] = useState<number>(initialParams?.maxHourlyRate || 1000000);
  const [sortBy, setSortBy] = useState<'rating_high' | 'rate_low' | 'rate_high'>(
    initialParams?.sortBy || 'rating_high'
  );

  const fetchFreelancers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await freelancerService.getFreelancers({
        searchQuery,
        skills: selectedSkills,
        maxHourlyRate,
        sortBy,
      });
      setFreelancers(data);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedSkills, maxHourlyRate, sortBy]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFreelancers();
  }, [fetchFreelancers]);

  const handleSkillChange = (skill: string, checked: boolean) => {
    setSelectedSkills((prev) =>
      checked ? [...prev, skill] : prev.filter((s) => s !== skill)
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSkills([]);
    setMaxHourlyRate(1000000);
    setSortBy('rating_high');
  };

  return {
    freelancers,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedSkills,
    maxHourlyRate,
    setMaxHourlyRate,
    sortBy,
    setSortBy,
    handleSkillChange,
    handleResetFilters,
    refetch: fetchFreelancers,
  };
}
